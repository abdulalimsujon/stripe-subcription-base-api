import { model, Schema, Types } from 'mongoose';

const PendingFeesSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: 'User',
    },
    customer_id: {
      type: String,
      required: true,
    },
    charge_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const PendingFees = model('PendingFees', PendingFeesSchema);
