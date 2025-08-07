import { TLoginUser, TLoginResponse } from './auth.interface';
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';

import httpStatus from 'http-status';
import { createToken } from '../../utilities/createToken';

export const loginUser = async (
  payload: TLoginUser,
): Promise<TLoginResponse> => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'User not found',
    };
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Password is incorrect',
    };
  }

  const token = createToken({ email: user.email, id: user._id });
  return { accessToken: token };
};
