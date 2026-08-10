import express from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  getEditors,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { validate, validateObjectId } from '../middleware/validationMiddleware.js';
import { uploadImage, handleMulterError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
];

const roleValidation = [
  body('role')
    .isIn(['client', 'editor', 'admin'])
    .withMessage('Role must be client, editor, or admin'),
];

const statusValidation = [
  body('isActive').isBoolean().withMessage('isActive must be a boolean value'),
];

router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  uploadImage.single('avatar'),
  handleMulterError,
  updateProfileValidation,
  validate,
  updateProfile
);
router.get('/editors', protect, getEditors);

router.get('/', protect, authorize('admin'), getAllUsers);
router.put(
  '/:id/role',
  protect,
  authorize('admin'),
  validateObjectId('id'),
  roleValidation,
  validate,
  updateUserRole
);
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  validateObjectId('id'),
  statusValidation,
  validate,
  updateUserStatus
);

export default router;