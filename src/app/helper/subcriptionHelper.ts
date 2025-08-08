/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import config from '../config';
import { CardDetailModel } from '../modules/cardDetail/cardDetail.model';
import { SubscriptionDetail } from '../modules/subcriptionDetail/subcriptionDetailModel';

const monthly_trial_subscription_start = async (
  customer_id: string,
  user_id: string,
  subscriptionPlan: any,
): Promise<null | { current_period_start: string; trial_end: string }> => {
  try {
    let subscriptionDetailData: any = null;

    const currentDate: Date = new Date();
    const futureDate: Date = new Date(currentDate);

    futureDate.setDate(futureDate.getDate() + subscriptionPlan.trial_days);
    futureDate.setHours(23, 59, 59, 999);

    const current_period_start: string = formatDate(currentDate);
    const trial_end: string = formatDate(futureDate);

    subscriptionDetailData = {
      user_id,
      stripe_subscription_id: null,
      stripe_subscription_schedule_id: '',
      stripe_customer_id: customer_id,
      subscription_plan_price_id: subscriptionPlan.stripe_price_id,
      plan_amount: subscriptionPlan.amount,
      plan_amount_currency: 'usd',
      plan_interval: 'month',
      plan_interval_count: 1,
      created: current_period_start,
      plan_period_start: current_period_start,
      plan_period_end: trial_end,
      trial_end: subscriptionPlan.trial_days,
      status: 'active',
    };
    const subDetail = new SubscriptionDetail(subscriptionDetailData);

    const result = await subDetail.save();

    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
const lifetime_trial_subscription_start = async (
  customer_id: string,
  user_id: string,
  subscriptionPlan: any,
): Promise<null | { current_period_start: string; trial_end: string }> => {
  try {
    let subscriptionDetailData: any = null;

    const currentDate: Date = new Date();
    const futureDate: Date = new Date(currentDate);

    futureDate.setDate(futureDate.getDate() + subscriptionPlan.trial_days);
    futureDate.setHours(23, 59, 59, 999);

    const current_period_start: string = formatDate(currentDate);
    const trial_end: string = formatDate(futureDate);

    subscriptionDetailData = {
      user_id,
      stripe_subscription_id: null,
      stripe_subscription_schedule_id: '',
      stripe_customer_id: customer_id,
      subscription_plan_price_id: subscriptionPlan.stripe_price_id,
      plan_amount: subscriptionPlan.amount,
      plan_amount_currency: 'usd',
      plan_interval: 'lifetime',
      plan_interval_count: 1,
      created: current_period_start,
      plan_period_start: current_period_start,
      plan_period_end: trial_end,
      trial_end: subscriptionPlan.trial_days,
      status: 'active',
    };
    const subDetail = new SubscriptionDetail(subscriptionDetailData);

    const result = await subDetail.save();

    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
const yearly_trial_subscription_start = async (
  customer_id: string,
  user_id: string,
  subscriptionPlan: any,
): Promise<null | { current_period_start: string; trial_end: string }> => {
  try {
    let subscriptionDetailData: any = null;

    const currentDate: Date = new Date();
    const futureDate: Date = new Date(currentDate);

    futureDate.setDate(futureDate.getDate() + subscriptionPlan.trial_days);
    futureDate.setHours(23, 59, 59, 999);

    const current_period_start: string = formatDate(currentDate);
    const trial_end: string = formatDate(futureDate);

    subscriptionDetailData = {
      user_id,
      stripe_subscription_id: null,
      stripe_subscription_schedule_id: '',
      stripe_customer_id: customer_id,
      subscription_plan_price_id: subscriptionPlan.stripe_price_id,
      plan_amount: subscriptionPlan.amount,
      plan_amount_currency: 'usd',
      plan_interval: 'year',
      plan_interval_count: 1,
      created: current_period_start,
      plan_period_start: current_period_start,
      plan_period_end: trial_end,
      trial_end: subscriptionPlan.trial_days,
      status: 'active',
    };
    const subDetail = new SubscriptionDetail(subscriptionDetailData);

    const result = await subDetail.save();

    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

// Example formatDate function
function formatDate(date: Date): string {
  return date.toISOString();
}

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
  yearly_trial_subscription_start,
  monthly_trial_subscription_start,
  lifetime_trial_subscription_start,
};
