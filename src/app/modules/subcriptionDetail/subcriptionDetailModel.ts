import { model, Schema, Types } from 'mongoose';

const subcriptionPlanDetailSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: 'User',
    },
    stripe_subscription_id: {
      type: String,
      required: false,
    },
    stripe_subscription_schedle_id: {
      type: String,
      required: false,
    },
    stripe_customer_id: {
      type: String,
      required: true,
    },
    subscriptionPlan_price_id: {
      type: String,
      required: false,
    },
    plan_amount: {
      type: Number,
      required: true,
    },
    plan_amount_currency: {
      type: String,
      required: true,
    },
    plan_interval: {
      type: String,
      required: false,
    },
    plan_interval_count: {
      type: Number,
      required: false,
    },
    created: {
      type: Date,
      required: true,
    },
    plan_period_start: {
      type: Date,
      required: true,
    },
    plan_period_end: {
      type: Date,
      required: true,
    },
    trail_end: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
    },
    cancel: {
      type: Boolean,
      default: false,
    },
    cancel_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const SubscriptionDetail = model(
  'SubscriptionDetail',
  subcriptionPlanDetailSchema,
);
