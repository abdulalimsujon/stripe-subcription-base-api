import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';
import { loginUser } from './auth.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  // Set access token in cookie
  res.cookie('token', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken: result.accessToken },
  });
});

export const authController = {
  login,
};
