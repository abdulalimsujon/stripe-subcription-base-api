import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';
import httpStatus from 'http-status';
import { subcriptionPlanServices } from './subcriptionPlan.service';
import { subscriptionPlanDetail } from '../subcriptionDetail/subcriptionDetailModel';
import { TSubscriptionPlan } from './subcriptionPlan.interface';
import config from '../../config';
import Stripe from 'stripe';
const stripe = new Stripe(config.stripe_secrate_key as string, {
  apiVersion: '2025-07-30.basil',
});

const createSubcriptionPlanIntoDb = catchAsync(async (req, res) => {
  const reqBody = req.body;
  const result = await subcriptionPlanServices.createSubcriptionPlan(reqBody);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'subcription plan created successfully',
    data: result,
  });
});

const allPlanFromDb = catchAsync(async (req, res) => {
  const result = await subcriptionPlanServices.getAllPlan();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'all plan fetched  successfully',
    data: result,
  });
});

const singlePlan = catchAsync(async (req, res) => {
  const planId = req.body.id;
  const id = req.user._id;
  const plan: TSubscriptionPlan =
    await subcriptionPlanServices.singlePlan(planId);
  const haveBuyAnyPlan = await subscriptionPlanDetail.countDocuments({
    user_id: id,
  });

  let msg = ' ';
  console.log(plan);

  if (haveBuyAnyPlan == 0 && plan.have_trail == true) {
    msg = `you will get ${plan[0].trial_days} days trial and after we will charge ${plan[0].amount} amount for ${plan[0].name} subscription plan `;
  } else {
    msg = `you will charge for this plan ${plan[0].amount} amount for ${plan[0].name} subscription plam`;
  }

  res.status(200).json({
    success: true,
    msg,
    result: plan,
  });
});

const createSubscription = catchAsync(async (req, res) => {
  const { id } = req.body;
  const userdata = req.user;
  const result = await subcriptionPlanServices.createSubscription(
    userdata.name,
    userdata.email,
    id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'customer created successfully',
    data: result,
  });
});

const generateStripeToken = catchAsync(async (req, res) => {
  const { number, exp_month, exp_year, cvc } = req.body;

  const token = await stripe.tokens.create({
    card: {
      number,
      exp_month,
      exp_year,
      cvc,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Token generated successfully',
    data: token,
  });
});

export const subcriptionPlancontroller = {
  createSubcriptionPlanIntoDb,
  allPlanFromDb,
  singlePlan,
  createSubscription,
  generateStripeToken,
};
