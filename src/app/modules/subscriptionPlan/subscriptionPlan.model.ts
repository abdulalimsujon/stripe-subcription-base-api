import { model, Schema } from 'mongoose';
import { TSubscriptionPlan } from './subcriptionPlan.interface';

const subcriptionSchema = new Schema<TSubscriptionPlan>(
  {
    name: {
      type: String,
      required: true,
    },
    stripe_price_id: {
      type: String,
      required: true,
    },
    have_trail: {
      type: Boolean,
      default: false,
    },
    trial_days: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const subscriptionPlan = model<TSubscriptionPlan>(
  'subscriptionPlan',
  subcriptionSchema,
);
