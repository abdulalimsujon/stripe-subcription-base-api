import express from 'express';
import { subcriptionPlancontroller } from './subcriptionPlan.controller';
import { validateRequest } from '../../middleware/validationSchemaRequest';
import { subscriptionPlanZodSchema } from './subcriptionPlan.validation';
import Auth from '../../middleware/Auth';

const router = express.Router();
router.post(
  '/add-plan',
  validateRequest(subscriptionPlanZodSchema),
  subcriptionPlancontroller.createSubcriptionPlanIntoDb,
);

router.get('/all-plan', subcriptionPlancontroller.allPlanFromDb);

router.post('/single-plan', Auth(), subcriptionPlancontroller.singlePlan);
router.post(
  '/create-subscription',
  Auth(),
  subcriptionPlancontroller.createSubscription,
);
// router.post(
//   '/generate-token',
//   Auth(),
//   subcriptionPlancontroller.generateStripeToken,
// );

export const subcriptionPlanRoute = router;
