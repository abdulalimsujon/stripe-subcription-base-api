import { model, Schema, Types } from 'mongoose';

const cardDetailModelSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      required: 'User',
    },
    customer_id: {
      type: String,
      required: true,
    },
    card_id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    card_no: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: false,
    },
    month: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const CardDetailModel = model('cardDetail', cardDetailModelSchema);
