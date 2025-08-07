import mongoose from 'mongoose';
import {
  TErrorSources,
  TgenericRerrorResponse,
} from '../interface/error.interface';

const handleValidationError = (
  error: mongoose.Error.ValidationError,
): TgenericRerrorResponse => {
  const errorSources: TErrorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error',
    errorSources,
  };
};

export default handleValidationError;