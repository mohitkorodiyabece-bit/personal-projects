import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import VideoVersion from '../models/VideoVersion.js';
import Feedback from '../models/Feedback.js';
import {
  canViewProject,
  assertCanViewProject,
  assertIsProjectOwner,
  assertIsAssignedEditor,
} from '../utils/projectPermissions.js';
import { uploadImageToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from '../services/notificationService.js';

const parseLinks = (raw) => {
  if (!raw) return [];
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((l) => l && l.url)
    .map((l) => ({
      label: String(l.label || 'Link').trim(),
      url: String(l.url).trim(),
    }));
};

export const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    deadline,
    budget,
    videoType,
    editingStyle,
    priority,
    revisionLimit,
    rawFileLinks,
    referenceLinks,
  } = req.body;

  const projectData = {
    title: title.trim(),
    description: description.trim(),
    client: req.user._id,
    deadline: new Date(deadline),
    budget: Number(budget),
    videoType,
    editingStyle: editingStyle.trim(),
    priority: priority || 'medium',
    revisionLimit: revisionLimit !== undefined ? Number(revisionLimit) : 3,
    rawFileLinks: parseLinks(rawFileLinks),
    referenceLinks: parseLinks(referenceLinks),
  };

  if (req.file) {
    const uploaded = await uploadImageToCloudinary(req.file, 'thumbnails');
    projectData.thumbnail = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const project = await Project.create(projectData);

  const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
  await Promise.all(
    admins.map((admin) =>
      createNotification({
        recipient: admin._id,
        sender: req.user._id,
        type: 'project_created',
        title: 'New project created',
        message: `${req.user.name} created a new project: "${project.title}"`,
        relatedProject: project._id,
      })
    )
  );

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: { project },
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 12, search } = req.query;

  const filter = {};

  if (req.user.role === 'client') {
    filter.client = req.user._id;
  } else if (req.user.role === 'editor') {
    filter.assignedEditor = req.user._id;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate('client', 'name email avatar')
      .populate('assignedEditor', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Project.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Projects retrieved successfully',
    data: {
      projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('client', 'name email avatar bio')
    .populate('assignedEditor', 'name email avatar bio skills');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  assertCanViewProject(project, req.user);

  res.status(200).json({
    success: true,
    message: 'Project retrieved successfully',
    data: { project },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  assertIsProjectOwner(project, req.user);

  const editableFields = [
    'title',
    'description',
    'deadline',
    'budget',
    'videoType',
    'editingStyle',
    'priority',
    'revisionLimit',
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'deadline') {
        project.deadline = new Date(req.body.deadline);
      } else if (field === 'budget' || field === 'revisionLimit') {
        project[field] = Number(req.body[field]);
      } else if (typeof req.body[field] === 'string') {
        project[field] = req.body[field].trim();
      } else {
        project[field] = req.body[field];
      }
    }
  });

  if (req.body.rawFileLinks !== undefined) {
    project.rawFileLinks = parseLinks(req.body.rawFileLinks);
  }
  if (req.body.referenceLinks !== undefined) {
    project.referenceLinks = parseLinks(req.body.referenceLinks);
  }

  if (req.file) {
    if (project.thumbnail?.publicId) {
      await deleteFromCloudinary(project.thumbnail.publicId, 'image');
    }
    const uploaded = await uploadImageToCloudinary(req.file, 'thumbnails');
    project.thumbnail = { url: uploaded.url, publicId: uploaded.publicId };
  }

  await project.save();

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: { project },
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (req.user.role !== 'admin') {
    assertIsProjectOwner(project, req.user);
  }

  const versions = await VideoVersion.find({ project: project._id });
  await Promise.all(
    versions.map((v) => deleteFromCloudinary(v.publicId, 'video'))
  );
  await VideoVersion.deleteMany({ project: project._id });
  await Feedback.deleteMany({ project: project._id });

  if (project.thumbnail?.publicId) {
    await deleteFromCloudinary(project.thumbnail.publicId, 'image');
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
    data: {},
  });
});

export const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
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
  ];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid project status provided');
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (!canViewProject(project, req.user)) {
    throw new ApiError(403, 'You are not authorized to access this project');
  }

  if (req.user.role === 'client' && !['files_submitted', 'cancelled'].includes(status)) {
    throw new ApiError(403, 'Clients can only mark files as submitted or cancel a project');
  }

  if (req.user.role === 'editor') {
    assertIsAssignedEditor(project, req.user);
  }

  const previousStatus = project.status;
  project.status = status;
  await project.save();

  const notifyRecipient =
    req.user.role === 'client' ? project.assignedEditor : project.client;

  if (notifyRecipient) {
    await createNotification({
      recipient: notifyRecipient,
      sender: req.user._id,
      type: 'status_changed',
      title: 'Project status updated',
      message: `"${project.title}" status changed from ${previousStatus} to ${status}`,
      relatedProject: project._id,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Project status updated successfully',
    data: { project },
  });
});

export const assignEditor = asyncHandler(async (req, res) => {
  const { editorId } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const editor = await User.findOne({ _id: editorId, role: 'editor' });

  if (!editor) {
    throw new ApiError(404, 'Editor not found');
  }

  if (!editor.isActive) {
    throw new ApiError(400, 'Cannot assign an inactive editor');
  }

  project.assignedEditor = editor._id;
  project.status = 'assigned';
  await project.save();

  await createNotification({
    recipient: editor._id,
    sender: req.user._id,
    type: 'project_assigned',
    title: 'New project assigned to you',
    message: `You have been assigned to work on "${project.title}"`,
    relatedProject: project._id,
  });

  await createNotification({
    recipient: project.client,
    sender: req.user._id,
    type: 'project_assigned',
    title: 'Editor assigned to your project',
    message: `${editor.name} has been assigned to "${project.title}"`,
    relatedProject: project._id,
  });

  res.status(200).json({
    success: true,
    message: 'Editor assigned successfully',
    data: { project },
  });
});

export const submitFinalDelivery = asyncHandler(async (req, res) => {
  const { finalDeliveryLink } = req.body;

  if (!finalDeliveryLink || !finalDeliveryLink.trim()) {
    throw new ApiError(400, 'Final delivery link is required');
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  assertIsAssignedEditor(project, req.user);

  project.finalDeliveryLink = finalDeliveryLink.trim();
  project.status = 'final_ready';
  await project.save();

  await createNotification({
    recipient: project.client,
    sender: req.user._id,
    type: 'final_delivered',
    title: 'Final delivery submitted',
    message: `The final version of "${project.title}" is ready for your approval`,
    relatedProject: project._id,
  });

  res.status(200).json({
    success: true,
    message: 'Final delivery link submitted successfully',
    data: { project },
  });
});

export const approveProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  assertIsProjectOwner(project, req.user);

  if (project.status !== 'final_ready') {
    throw new ApiError(400, 'Project must have a final delivery submitted before it can be approved');
  }

  project.finalApproved = true;
  project.status = 'completed';
  await project.save();

  if (project.assignedEditor) {
    await createNotification({
      recipient: project.assignedEditor,
      sender: req.user._id,
      type: 'project_completed',
      title: 'Project approved and completed',
      message: `"${project.title}" has been approved by the client and marked completed`,
      relatedProject: project._id,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Project approved and marked as completed',
    data: { project },
  });
});