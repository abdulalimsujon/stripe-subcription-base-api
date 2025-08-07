export type TSubscriptionPlan = {
  name: string;
  stripe_price_id: string;
  have_trail?: boolean;
  trial_days: number;
  type: number;
  amount: number;
};
