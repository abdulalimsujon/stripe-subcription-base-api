import express from 'express';
import { userRoute } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { subcriptionPlanRoute } from '../modules/subscriptionPlan/subcriptionPlan.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/subscription',
    route: subcriptionPlanRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
