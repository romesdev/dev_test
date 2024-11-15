import { z } from 'zod';

export const postRegistrationSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(100),
  userId: z.number(),
});
