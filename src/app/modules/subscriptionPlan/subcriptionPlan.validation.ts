import { z } from 'zod';

export const subscriptionPlanZodSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  stripe_price_id: z.string({
    required_error: 'Stripe price ID is required',
  }),
  have_trail: z.boolean().optional().default(false),
  trial_days: z.number({
    required_error: 'Trial days is required',
  }),
  type: z.number({
    required_error: 'Type is required',
  }),
});
