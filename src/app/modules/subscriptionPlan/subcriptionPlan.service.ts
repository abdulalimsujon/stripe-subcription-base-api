import { createCustomer } from '../../helper/subcriptionHelper';
import { TSubscriptionPlan } from './subcriptionPlan.interface';
import { subscriptionPlan } from './subscriptionPlan.model';

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

const createSubscription = async (name: string, email: string, id: string) => {
  const result = await createCustomer(name, email, id);

  return result;
};

export const subcriptionPlanServices = {
  createSubcriptionPlan,
  getAllPlan,
  singlePlan,
  createSubscription,
};
