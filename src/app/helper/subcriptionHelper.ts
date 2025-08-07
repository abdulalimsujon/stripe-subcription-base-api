import Stripe from 'stripe';
import config from '../config';
import { CardDetailModel } from '../modules/cardDetail/cardDetail.model';

const stripe = new Stripe(config.stripe_secrate_key as string, {
  apiVersion: '2025-07-30.basil',
});
const createCustomer = async (
  name: string,
  email: string,
  token_id: string,
) => {
  try {
    const customer = await stripe.customers.create({
      name,
      email,
      source: token_id,
    });

    return {
      success: true,
      data: customer,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
const saveCardDetails = async (
  data: any,
  user_id: string,
  customer_id: string,
) => {
  try {
    const cardDetail = new CardDetailModel({
      user_id,
      customer_id,
      card_id: data.id,
      name: data.name ? data.name : ' ',
      card_no: data.last4,
      brand: data.brand,
      month: data.exp_month,
      year: data.exp_year,
    });
    const result = await cardDetail.save();

    return {
      success: true,
      data: result,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const subcriptionHelper = {
  createCustomer,
  saveCardDetails,
};
