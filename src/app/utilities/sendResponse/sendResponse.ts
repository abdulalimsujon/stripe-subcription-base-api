import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    token?: string;
    message?: string;
    data: T;
  },
) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    token: data?.token,
    data: data.data,
  });
};

export default sendResponse;
