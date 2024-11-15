import { z } from 'zod';

export const userRegistrationSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  email: z.string().email(),
});
