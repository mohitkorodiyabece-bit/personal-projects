import express from 'express';
import { body } from 'express-validator';
import {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  resolveFeedback,
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, validateObjectId } from '../middleware/validationMiddleware.js';

const versionFeedbackRouter = express.Router({ mergeParams: true });

const feedbackValidation = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Feedback message is required')
    .isLength({ min: 2, max: 1000 })
    .withMessage('Feedback message must be between 2 and 1000 characters'),
  body('timestamp')
    .notEmpty()
    .withMessage('Timestamp is required')
    .isFloat({ min: 0 })
    .withMessage('Timestamp must be a non-negative number'),
];

const updateFeedbackValidation = [
  body('message')
    .optional()
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('Feedback message must be between 2 and 1000 characters'),
];

versionFeedbackRouter.post(
  '/',
  protect,
  validateObjectId('versionId'),
  feedbackValidation,
  validate,
  createFeedback
);

versionFeedbackRouter.get(
  '/',
  protect,
  validateObjectId('versionId'),
  getFeedback
);

const feedbackRouter = express.Router();

feedbackRouter.put(
  '/:id',
  protect,
  validateObjectId('id'),
  updateFeedbackValidation,
  validate,
  updateFeedback
);
feedbackRouter.delete('/:id', protect, validateObjectId('id'), deleteFeedback);
feedbackRouter.put('/:id/resolve', protect, validateObjectId('id'), resolveFeedback);

export { versionFeedbackRouter, feedbackRouter };