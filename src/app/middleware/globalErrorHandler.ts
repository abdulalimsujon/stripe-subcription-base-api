/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error.interface';
import config from '../config';
import handleZodError from '../Errors/HandleZodError';
import handleValidationError from '../Errors/HandleValidationError';
import handleCastError from '../Errors/HandleCastError';
import handleDublicateKeyError from '../Errors/handleDuplicateError';
import AppError from '../Errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'something went wrong';

  let errorSources: TErrorSources = [
    {
      path: '',
      message,
    },
  ];

  if (error instanceof ZodError) {
    const simplifliedError = handleZodError(error);
    statusCode = simplifliedError?.statusCode;
    message = simplifliedError?.message;
    errorSources = simplifliedError?.errorSources;
  } else if (error?.name === 'ValidationError') {
    const simplifliedError = handleValidationError(error);
    statusCode = simplifliedError?.statusCode;
    message = simplifliedError?.message;
    errorSources = simplifliedError?.errorSources;
  } else if (error?.name === 'CastError') {
    const simplifliedError = handleCastError(error);
    statusCode = simplifliedError?.statusCode;
    message = simplifliedError?.message;
    errorSources = simplifliedError?.errorSources;
  } else if (error?.code === 11000) {
    const simplifliedError = handleDublicateKeyError(error);
    statusCode = simplifliedError?.statusCode;
    message = simplifliedError?.message;
    errorSources = simplifliedError?.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;

    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error?.message;
    errorSources = [
      {
        path: '',
        message: error?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    // error,
    errorSources,
    stack: config.node_env=== 'development' ? error.stack : null,
  });
};

export default globalErrorHandler;