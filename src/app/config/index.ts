import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  salt_round: process.env.SALT_ROUND,
  node_env: process.env.NODE_ENV,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  stripe_secrate_key: process.env.STRIPE_SECRATE_KEY,
};
