import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utilities/catchAsync';
import AppError from '../Errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';

const Auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    console.log('fsdhsggkjshdkfh');

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_secret as string,
    ) as JwtPayload;

    const { id } = decoded;
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    req.user = user;

    next();
  });
};

export default Auth;
