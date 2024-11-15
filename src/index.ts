import 'reflect-metadata';
import express from 'express';
import { userRegistrationSchema } from './schemas/userSchemas';
import { validateData } from './middleware/validationMiddleware';
import { postRegistrationSchema } from './schemas/postSchema';
import { initializeDatabase } from './config/database';
import { UserController } from './controllers/userController';
import { PostController } from './controllers/postController';

const app = express();
app.use(express.json());

initializeDatabase();

const userController = new UserController();
const postController = new PostController();

app.get('/', async (_, res) => {
  console.log('hello world!');
  res.send('hello world');
});

app.post(
  '/users',
  validateData(userRegistrationSchema),
  userController.create.bind(userController)
);

app.post(
  '/posts',
  validateData(postRegistrationSchema),
  postController.create.bind(postController)
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
