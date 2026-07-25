import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import VideoVersion from '../models/VideoVersion.js';
import Project from '../models/Project.js';
import Feedback from '../models/Feedback.js';
import { assertCanViewProject } from '../utils/projectPermissions.js';
import { createNotification } from '../services/notificationService.js';

export const createFeedback = asyncHandler(async (req, res) => {
  const { versionId } = req.params;
  const { message, timestamp } = req.body;

  const version = await VideoVersion.findById(versionId);

  if (!version) {
    throw new ApiError(404, 'Video version not found');
  }

  const project = await Project.findById(version.project);

  if (!project) {
    throw new ApiError(404, 'Associated project not found');
  }

  assertCanViewProject(project, req.user);

  const feedback = await Feedback.create({
    project: project._id,
    videoVersion: version._id,
    author: req.user._id,
    message: message.trim(),
    timestamp: Number(timestamp),
  });

  const populated = await feedback.populate('author', 'name email avatar role');

  const notifyRecipient =
    req.user.role === 'client' ? project.assignedEditor : project.client;

  if (notifyRecipient) {
    await createNotification({
      recipient: notifyRecipient,
      sender: req.user._id,
      type: 'feedback_added',
      title: 'New feedback comment',
      message: `${req.user.name} left feedback on "${project.title}" (v${version.versionNumber})`,
      relatedProject: project._id,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Feedback added successfully',
    data: { feedback: populated },
  });
});

export const getFeedback = asyncHandler(async (req, res) => {
  const { versionId } = req.params;

  const version = await VideoVersion.findById(versionId);

  if (!version) {
    throw new ApiError(404, 'Video version not found');
  }

  const project = await Project.findById(version.project);

  if (!project) {
    throw new ApiError(404, 'Associated project not found');
  }

  assertCanViewProject(project, req.user);

  const feedback = await Feedback.find({ videoVersion: versionId })
    .populate('author', 'name email avatar role')
    .populate('resolvedBy', 'name email')
    .sort({ timestamp: 1 });

  res.status(200).json({
    success: true,
    message: 'Feedback retrieved successfully',
    data: { feedback, count: feedback.length },
  });
});

export const updateFeedback = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found');
  }

  if (
    req.user.role !== 'admin' &&
    feedback.author.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'You can only edit your own feedback');
  }

  if (message !== undefined) {
    feedback.message = message.trim();
  }

  await feedback.save();

  const populated = await feedback.populate('author', 'name email avatar role');

  res.status(200).json({
    success: true,
    message: 'Feedback updated successfully',
    data: { feedback: populated },
  });
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found');
  }

  if (
    req.user.role !== 'admin' &&
    feedback.author.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'You can only delete your own feedback');
  }

  await feedback.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Feedback deleted successfully',
    data: {},
  });
});

export const resolveFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found');
  }

  const project = await Project.findById(feedback.project);

  if (!project) {
    throw new ApiError(404, 'Associated project not found');
  }

  assertCanViewProject(project, req.user);

  feedback.resolved = true;
  feedback.resolvedBy = req.user._id;
  await feedback.save();

  const populated = await feedback
    .populate('author', 'name email avatar role')
    .then((f) => f.populate('resolvedBy', 'name email'));

  if (feedback.author.toString() !== req.user._id.toString()) {
    await createNotification({
      recipient: feedback.author,
      sender: req.user._id,
      type: 'feedback_resolved',
      title: 'Feedback marked resolved',
      message: `Your feedback on "${project.title}" was marked as resolved`,
      relatedProject: project._id,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Feedback marked as resolved',
    data: { feedback: populated },
  });
});