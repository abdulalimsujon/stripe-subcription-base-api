import express from 'express';
import { usercontroller } from './user.controller';

import { createUserZodSchema } from './user.validation';
import { validateRequest } from '../../middleware/validationSchemaRequest';
const router = express.Router();
router.post(
  '/create-user',
  validateRequest(createUserZodSchema),
  usercontroller.createUser,
);

export const userRoute = router;
