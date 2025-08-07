import Stripe from 'stripe';
import { subcriptionHelper } from '../../helper/subcriptionHelper';
import { TSubscriptionPlan } from './subcriptionPlan.interface';
import { subscriptionPlan } from './subscriptionPlan.model';
import config from '../../config';
import { CardDetailModel } from '../cardDetail/cardDetail.model';
const stripe = new Stripe(config.stripe_secrate_key as string, {
  apiVersion: '2025-07-30.basil',
});

const createSubcriptionPlan = async (data: TSubscriptionPlan) => {
  const result = await subscriptionPlan.create(data);

  return result;
};

const getAllPlan = async () => {
  const result = await subscriptionPlan.find({});
  return result;
};
const singlePlan = async (id: string) => {
  const result = await subscriptionPlan.find({ _id: id });

  return result;
};

export const createSubscription = async (
  name: string,
  email: string,
  stripe_string: string,
  userId: string,
) => {
  try {
    // Create Stripe customer
    const customer = await stripe.customers.create({ name, email });

    let cardData;

    if (stripe_string.startsWith('pm_')) {
      // PaymentMethod ID
      await stripe.paymentMethods.attach(stripe_string, {
        customer: customer.id,
      });

      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: stripe_string,
        },
      });

      const paymentMethod = await stripe.paymentMethods.retrieve(stripe_string);

      if (!paymentMethod.card) throw new Error('Invalid card details');

      cardData = {
        card_id: paymentMethod.id,
        name: paymentMethod.billing_details.name || name,
        brand: paymentMethod.card.brand,
        card_no: paymentMethod.card.last4,
        month: paymentMethod.card.exp_month.toString(),
        year: paymentMethod.card.exp_year.toString(),
      };
    } else if (stripe_string.startsWith('tok_')) {
      // Card token (for test mode)
      const source = await stripe.customers.createSource(customer.id, {
        source: stripe_string,
      });

      if (source.object !== 'card') throw new Error('Invalid source');

      cardData = {
        card_id: source.id,
        name: name,
        brand: source.brand,
        card_no: source.last4,
        month: source.exp_month.toString(),
        year: source.exp_year.toString(),
      };
    } else {
      throw new Error('Invalid stripe_string format');
    }

    // Save to MongoDB
    const cardDocument = await CardDetailModel.create({
      user_id: userId,
      customer_id: customer.id,
      ...cardData,
    });

    return {
      success: true,
      customer,
      card: cardDocument,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const subcriptionPlanServices = {
  createSubcriptionPlan,
  getAllPlan,
  singlePlan,
  createSubscription,
};
