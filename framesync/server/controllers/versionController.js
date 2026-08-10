import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import Project from '../models/Project.js';
import VideoVersion from '../models/VideoVersion.js';
import Feedback from '../models/Feedback.js';
import { assertCanViewProject, assertIsAssignedEditor } from '../utils/projectPermissions.js';
import { uploadVideoToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from '../services/notificationService.js';

export const uploadVersion = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { notes } = req.body;

  if (!req.file) {
    throw new ApiError(400, 'A video file is required');
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  assertIsAssignedEditor(project, req.user);

  const lastVersion = await VideoVersion.findOne({ project: projectId })
    .sort({ versionNumber: -1 })
    .select('versionNumber');

  const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

  const uploaded = await uploadVideoToCloudinary(req.file, 'previews');

  const version = await VideoVersion.create({
    project: projectId,
    versionNumber: nextVersionNumber,
    videoUrl: uploaded.url,
    publicId: uploaded.publicId,
    uploadedBy: req.user._id,
    notes: notes ? notes.trim() : '',
    duration: uploaded.duration,
  });

  project.status = 'preview_ready';
  await project.save();

  await createNotification({
    recipient: project.client,
    sender: req.user._id,
    type: 'version_uploaded',
    title: 'New preview version uploaded',
    message: `Version ${version.versionNumber} of "${project.title}" is ready to review`,
    relatedProject: project._id,
  });

  res.status(201).json({
    success: true,
    message: 'Video version uploaded successfully',
    data: { version },
  });
});

export const getVersions = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  assertCanViewProject(project, req.user);

  const versions = await VideoVersion.find({ project: projectId })
    .populate('uploadedBy', 'name email avatar')
    .sort({ versionNumber: -1 });

  res.status(200).json({
    success: true,
    message: 'Video versions retrieved successfully',
    data: { versions, count: versions.length },
  });
});

export const getVersionById = asyncHandler(async (req, res) => {
  const version = await VideoVersion.findById(req.params.id).populate(
    'uploadedBy',
    'name email avatar'
  );

  if (!version) {
    throw new ApiError(404, 'Video version not found');
  }

  const project = await Project.findById(version.project);

  if (!project) {
    throw new ApiError(404, 'Associated project not found');
  }

  assertCanViewProject(project, req.user);

  res.status(200).json({
    success: true,
    message: 'Video version retrieved successfully',
    data: { version, project },
  });
});

export const deleteVersion = asyncHandler(async (req, res) => {
  const version = await VideoVersion.findById(req.params.id);

  if (!version) {
    throw new ApiError(404, 'Video version not found');
  }

  const project = await Project.findById(version.project);

  if (!project) {
    throw new ApiError(404, 'Associated project not found');
  }

  if (req.user.role !== 'admin') {
    assertIsAssignedEditor(project, req.user);
  }

  await deleteFromCloudinary(version.publicId, 'video');
  await Feedback.deleteMany({ videoVersion: version._id });
  await version.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Video version deleted successfully',
    data: {},
  });
});