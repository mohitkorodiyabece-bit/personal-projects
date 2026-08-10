import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';

const activeStatuses = [
  'files_submitted',
  'assigned',
  'editing',
  'preview_ready',
  'client_review',
  'revision_requested',
  'final_ready',
];

export const getClientDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== 'client') {
    throw new ApiError(403, 'This dashboard is only available to clients');
  }

  const clientId = req.user._id;

  const [
    totalProjects,
    activeProjects,
    waitingForReview,
    completedProjects,
    recentProjects,
    upcomingDeadlines,
    recentNotifications,
  ] = await Promise.all([
    Project.countDocuments({ client: clientId }),
    Project.countDocuments({ client: clientId, status: { $in: activeStatuses } }),
    Project.countDocuments({ client: clientId, status: 'preview_ready' }),
    Project.countDocuments({ client: clientId, status: 'completed' }),
    Project.find({ client: clientId })
      .populate('assignedEditor', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5),
    Project.find({
      client: clientId,
      status: { $nin: ['completed', 'cancelled'] },
      deadline: { $gte: new Date() },
    })
      .sort({ deadline: 1 })
      .limit(5)
      .select('title deadline status priority'),
    Notification.find({ recipient: clientId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('relatedProject', 'title'),
  ]);

  res.status(200).json({
    success: true,
    message: 'Client dashboard data retrieved successfully',
    data: {
      stats: {
        totalProjects,
        activeProjects,
        waitingForReview,
        completedProjects,
      },
      recentProjects,
      upcomingDeadlines,
      recentNotifications,
    },
  });
});

export const getEditorDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== 'editor') {
    throw new ApiError(403, 'This dashboard is only available to editors');
  }

  const editorId = req.user._id;

  const [
    assignedProjects,
    currentlyEditing,
    awaitingRevisions,
    upcomingDeadlines,
    recentFeedback,
  ] = await Promise.all([
    Project.countDocuments({ assignedEditor: editorId }),
    Project.countDocuments({ assignedEditor: editorId, status: 'editing' }),
    Project.countDocuments({ assignedEditor: editorId, status: 'revision_requested' }),
    Project.find({
      assignedEditor: editorId,
      status: { $nin: ['completed', 'cancelled'] },
      deadline: { $gte: new Date() },
    })
      .sort({ deadline: 1 })
      .limit(5)
      .select('title deadline status priority'),
    Feedback.find({})
      .populate({
        path: 'project',
        match: { assignedEditor: editorId },
        select: 'title assignedEditor',
      })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const filteredFeedback = recentFeedback.filter((f) => f.project !== null).slice(0, 5);

  const assignedProjectsList = await Project.find({ assignedEditor: editorId })
    .populate('client', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    message: 'Editor dashboard data retrieved successfully',
    data: {
      stats: {
        assignedProjects,
        currentlyEditing,
        awaitingRevisions,
      },
      assignedProjectsList,
      upcomingDeadlines,
      recentFeedback: filteredFeedback,
    },
  });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'This dashboard is only available to admins');
  }

  const [
    totalUsers,
    totalClients,
    totalEditors,
    totalProjects,
    activeProjectsCount,
    completedProjectsCount,
    projectsByStatusRaw,
    recentUsers,
    recentProjects,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'client' }),
    User.countDocuments({ role: 'editor' }),
    Project.countDocuments({}),
    Project.countDocuments({ status: { $in: activeStatuses } }),
    Project.countDocuments({ status: 'completed' }),
    Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.find({}).sort({ createdAt: -1 }).limit(5).select('name email role createdAt avatar'),
    Project.find({})
      .populate('client', 'name avatar')
      .populate('assignedEditor', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const projectsByStatus = projectsByStatusRaw.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    message: 'Admin dashboard data retrieved successfully',
    data: {
      stats: {
        totalUsers,
        totalClients,
        totalEditors,
        totalProjects,
        activeProjects: activeProjectsCount,
        completedProjects: completedProjectsCount,
      },
      projectsByStatus,
      recentUsers,
      recentProjects,
    },
  });
});