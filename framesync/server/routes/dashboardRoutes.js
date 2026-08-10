import express from 'express';
import {
  getClientDashboard,
  getEditorDashboard,
  getAdminDashboard,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/client', protect, authorize('client'), getClientDashboard);
router.get('/editor', protect, authorize('editor'), getEditorDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

export default router;