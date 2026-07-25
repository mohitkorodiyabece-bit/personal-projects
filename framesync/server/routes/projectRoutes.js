import express from 'express';
import { body } from 'express-validator';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
  assignEditor,
  submitFinalDelivery,
  approveProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { validate, validateObjectId } from '../middleware/validationMiddleware.js';
import { uploadImage, handleMulterError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be between 3 and 120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 3000 })
    .withMessage('Description must be between 10 and 3000 characters'),
  body('deadline')
    .notEmpty()
    .withMessage('Deadline is required')
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('videoType')
    .isIn([
      'youtube',
      'short_form',
      'commercial',
      'wedding',
      'corporate',
      'music_video',
      'documentary',
      'social_media',
      'other',
    ])
    .withMessage('Invalid video type'),
  body('editingStyle')
    .trim()
    .notEmpty()
    .withMessage('Editing style is required')
    .isLength({ max: 120 })
    .withMessage('Editing style cannot exceed 120 characters'),
  body('revisionLimit')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Revision limit must be between 0 and 20'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
];

const statusValidation = [
  body('status')
    .isIn([
      'created',
      'files_submitted',
      'assigned',
      'editing',
      'preview_ready',
      'client_review',
      'revision_requested',
      'final_ready',
      'approved',
      'completed',
      'cancelled',
    ])
    .withMessage('Invalid project status'),
];

const assignValidation = [
  body('editorId').isMongoId().withMessage('A valid editor ID is required'),
];

const finalDeliveryValidation = [
  body('finalDeliveryLink')
    .trim()
    .notEmpty()
    .withMessage('Final delivery link is required')
    .isURL()
    .withMessage('Final delivery link must be a valid URL'),
];

router.post(
  '/',
  protect,
  authorize('client'),
  uploadImage.single('thumbnail'),
  handleMulterError,
  projectValidation,
  validate,
  createProject
);

router.get('/', protect, getProjects);

router.get('/:id', protect, validateObjectId('id'), getProjectById);

router.put(
  '/:id',
  protect,
  validateObjectId('id'),
  uploadImage.single('thumbnail'),
  handleMulterError,
  updateProject
);

router.delete('/:id', protect, validateObjectId('id'), deleteProject);

router.put(
  '/:id/status',
  protect,
  validateObjectId('id'),
  statusValidation,
  validate,
  updateProjectStatus
);

router.put(
  '/:id/assign',
  protect,
  authorize('admin'),
  validateObjectId('id'),
  assignValidation,
  validate,
  assignEditor
);

router.put(
  '/:id/final-delivery',
  protect,
  authorize('editor'),
  validateObjectId('id'),
  finalDeliveryValidation,
  validate,
  submitFinalDelivery
);

router.put(
  '/:id/approve',
  protect,
  authorize('client'),
  validateObjectId('id'),
  approveProject
);

export default router;