/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    TErrorSources,
    TgenericRerrorResponse,
  } from '../interface/error.interface';
  
  const handleDublicateKeyError = (error: any): TgenericRerrorResponse => {
    const errorSources: TErrorSources = [
      {
        path: error?.keyValue,
        message: 'Duplicate keyError',
      },
    ];
  
    const statusCode = 400;
  
    return {
      statusCode,
      message: 'validation error',
      errorSources,
    };
  };
  
  export default handleDublicateKeyError;