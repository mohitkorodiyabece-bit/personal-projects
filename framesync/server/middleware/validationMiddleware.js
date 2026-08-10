import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import ApiError from '../utils/apiError.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};

export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new ApiError(400, `Invalid ID format for parameter: ${paramName}`);
    }

    next();
  };
};