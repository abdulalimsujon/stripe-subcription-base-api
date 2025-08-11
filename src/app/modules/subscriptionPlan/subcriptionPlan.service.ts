import Stripe from 'stripe';
import { subcriptionHelper } from '../../helper/subcriptionHelper';
import { TSubscriptionPlan } from './subcriptionPlan.interface';
import { subscriptionPlan } from './subscriptionPlan.model';
import config from '../../config';
import { CardDetailModel } from '../cardDetail/cardDetail.model';
import { SubscriptionDetail } from '../subcriptionDetail/subcriptionDetailModel';

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
  planId: string,
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

    await CardDetailModel.create({
      user_id: userId,
      customer_id: customer.id,
      ...cardData,
    });

    // subscription conditions starts
    const isAlreadybroughtSubcription = await SubscriptionDetail.countDocuments(
      {
        user_id: userId,
      },
    );

    const activesubscriptionDetail = await SubscriptionDetail.findOne({
      user_id: userId,
      status: 'active',
      cancel: false,
    });

    if (
      activesubscriptionDetail &&
      activesubscriptionDetail.plan_interval == 'month' &&
      activesubscriptionDetail.plan_interval == 0 // ❌ this will never match — choose one type
    ) {
    } else if (
      activesubscriptionDetail &&
      activesubscriptionDetail.plan_interval == 'year' &&
      activesubscriptionDetail.plan_interval == 1
    ) {
    } else if (
      activesubscriptionDetail &&
      activesubscriptionDetail.plan_interval == 'lifetime' &&
      activesubscriptionDetail.plan_interval == 2
    ) {
    } else {
      if (isAlreadybroughtSubcription) {
        const plan = await subscriptionPlan.findOne({ _id: planId });

        let data;
        if (plan?.type == 0) {
          data = await subcriptionHelper.monthly_trial_subscription_start(
            customer.id,
            userId,
            plan,
          );
        }
        if (plan?.type == 1) {
          data = await subcriptionHelper.yearly_trial_subscription_start(
            customer.id,
            userId,
            plan,
          );
        }
        if (plan?.type == 2) {
          data = await subcriptionHelper.lifetime_trial_subscription_start(
            customer.id,
            userId,
            plan,
          );
          return data;
        } else {
          if (
            activesubscriptionDetail &&
            activesubscriptionDetail.plan_interval == 0
          ) {
          } else if (
            activesubscriptionDetail &&
            activesubscriptionDetail.plan_interval == 1
          ) {
          } else if (
            activesubscriptionDetail &&
            activesubscriptionDetail.plan_interval == 2
          ) {
          } else {
          }
        }
      }
    }
    // subscription condition ends

    //subcriptions working starts
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
