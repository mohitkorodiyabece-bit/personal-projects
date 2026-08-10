import express from 'express';
import { body } from 'express-validator';
import {
  uploadVersion,
  getVersions,
  getVersionById,
  deleteVersion,
} from '../controllers/versionController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { validate, validateObjectId } from '../middleware/validationMiddleware.js';
import { uploadVideo, handleMulterError } from '../middleware/uploadMiddleware.js';

const projectVersionRouter = express.Router({ mergeParams: true });

const notesValidation = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),
];

projectVersionRouter.post(
  '/',
  protect,
  authorize('editor'),
  validateObjectId('projectId'),
  uploadVideo.single('video'),
  handleMulterError,
  notesValidation,
  validate,
  uploadVersion
);

projectVersionRouter.get(
  '/',
  protect,
  validateObjectId('projectId'),
  getVersions
);

const versionRouter = express.Router();

versionRouter.get('/:id', protect, validateObjectId('id'), getVersionById);
versionRouter.delete('/:id', protect, validateObjectId('id'), deleteVersion);

export { projectVersionRouter, versionRouter };