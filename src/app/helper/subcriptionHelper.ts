/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import config from '../config';
import { CardDetailModel } from '../modules/cardDetail/cardDetail.model';
import { SubscriptionDetail } from '../modules/subcriptionDetail/subcriptionDetailModel';
import { PendingFees } from '../modules/pendingFees/pendingFeesModel';

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
      trial_end: trial_end,
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

function getDaysInMonth(){
   const now = new Date();


  return  new Date(now.getFullYear(),now.getMonth()+1,0).getDate(); 
}

function getCurrentDate(){
     const now = new Date();
     return now.getDate();
}

const capture_monthly_pending_fees = async(customer_id,user_id,user_name,subcriptionPlan)=>{
  try{
     var caputureChargeData = null;
     const plantAmount =  subcriptionPlan.amount;
     const daysInMonth = getDaysInMonth();
     const currentDay = getCurrentDate();


     const amoutForRestDays =  Math.ceil(daysInMonth-(currentDay-1)*( (plantAmount/daysInMonth)));

     const charges = await stripe.charges.create({
        amount: amoutForRestDays * 100,
        currency: 'usd',
        customer: customer_id,
        description:"Monthly Pending Fees charges",
        shipping: {
          name: user_name,
          address: {
            line1: "dsgj",
            line2:"gskjlka",
            postal_code:'12345',
            country:'US'
          }
        }
     })
   const pendingFee=  new PendingFees ({
          user_id,
          charge_id: charges.id,
          customer_id,
          amount: amoutForRestDays

    })

    caputureChargeData = await pendingFee.save()
     return caputureChargeData;

  }catch(error){

    console.log(error)

  }
}

const monthly_subcription_start = async(customer_id,user_id,subscriptionPlan)=>{

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth()+1);
  currentDate.setDate(1);
  currentDate.setHours(0,0,0,0);

  const current_period_start = formatDate(currentDate);

  const billingCycleAnchor = Math.floor(currentDate.getTime()/1000);

  currentDate.setMonth(currentDate.getMonth()+1,0);
  currentDate.setHours(23,59,59,10);
  const current_period_end = formatDate(currentDate);

  const subcription = await stripe.subscriptions.create({
    customer: customer_id,
    items: [{
      price: subscriptionPlan.stripe_price_id
    }],
    billing_cycle_anchor: billingCycleAnchor,
    proration_behavior: 'none'
  })

const  subscriptionDetailData = {
      user_id,
      stripe_subscription_id: subcription.id,
      stripe_subscription_schedule_id: subcription.schedule,
      stripe_customer_id: customer_id,
      subscription_plan_price_id: subscriptionPlan.stripe_price_id,
      plan_amount: subscriptionPlan.amount,
      plan_amount_currency: 'usd',
      plan_interval: 'month',
      plan_interval_count: subcription.plan.interval_count,
      created: current_period_start,
      plan_period_start: current_period_start,
      plan_period_end: current_period_end,
      trial_end: null,
      status: 'active',
    };

  const subDetail = new SubscriptionDetail(subscriptionDetailData);

  const subcriptionData = subDetail.save();
  return subcriptionData;
}

export const subcriptionHelper = {
  createCustomer,
  saveCardDetails,
  yearly_trial_subscription_start,
  monthly_trial_subscription_start,
  lifetime_trial_subscription_start,
  capture_monthly_pending_fees,
  monthly_subcription_start
};
