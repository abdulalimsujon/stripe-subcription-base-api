import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';
import { userServices } from './user.service';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req, res) => {
  const reqBody = req.body;
  const result = await userServices.createUserIntoDb(reqBody);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: result,
  });
});

export const usercontroller = {
  createUser,
};
