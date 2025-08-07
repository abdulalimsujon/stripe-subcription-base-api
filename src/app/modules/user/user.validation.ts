import { z } from 'zod';

export const createUserZodSchema = z.object({
  username: z.string({
    required_error: 'Username is required',
  }),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters long'), // you can adjust this
});
