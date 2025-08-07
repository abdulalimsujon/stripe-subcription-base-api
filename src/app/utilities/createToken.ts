import jwt from 'jsonwebtoken';
import config from '../config';

export const createToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in || '1h',
  });
};
