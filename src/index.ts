import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Post } from './entity/Post';
import {
  BAD_REQUEST_STATUS_CODE,
  CREATED_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} from './utils';
import { userRegistrationSchema } from './schemas/userSchemas';
import { validateData } from './middleware/validationMiddleware';
import { postRegistrationSchema } from './schemas/postSchema';

const app = express();
app.use(express.json());

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'test_db',
  entities: [User, Post],
  synchronize: true,
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeDatabase = async () => {
  await wait(200);
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  }
};

initializeDatabase();

app.get('/', async (_, res) => {
  console.log('hello world!');
  res.send('hello world');
});

app.post('/users', validateData(userRegistrationSchema), async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    const user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    await AppDataSource.manager.save(user);

    res.status(CREATED_STATUS_CODE).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .json({ error: 'Internal server error' });
  }
});

app.post('/posts', validateData(postRegistrationSchema), async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const user = await AppDataSource.manager.findOneBy(User, { id: userId });

    if (!user)
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .json({ error: 'User not exists' });

    const post = new Post();

    post.title = title;
    post.description = description;
    post.user = user;

    await AppDataSource.manager.save(post);

    return res.status(CREATED_STATUS_CODE).json(post);
  } catch (error) {
    console.error(error);
    res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
