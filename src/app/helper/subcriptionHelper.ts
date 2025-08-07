import Stripe from 'stripe';
import config from '../config';

const stripe = new Stripe(config.stripe_secrate_key as string, {
  apiVersion: '2025-07-30.basil',
});
export const createCustomer = async (
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

    console.log('Customer created:', customer);
    return customer;
  } catch (error) {
    console.error('Stripe error:', error);
    throw error;
  }
};

export const subcriptionHelper = {
  createCustomer,
};
