import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/User.js';
import { uploadImageToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from '../services/notificationService.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      user: req.user.toSafeObject(),
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, skills } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name !== undefined) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (skills !== undefined) {
    user.skills = Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter(Boolean)
      : [];
  }

  if (req.file) {
    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId, 'image');
    }
    const uploaded = await uploadImageToCloudinary(req.file, 'avatars');
    user.avatar = { url: uploaded.url, publicId: uploaded.publicId };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toSafeObject(),
    },
  });
});

export const getEditors = asyncHandler(async (req, res) => {
  const editors = await User.find({ role: 'editor', isActive: true }).select(
    'name email avatar bio skills createdAt'
  );

  res.status(200).json({
    success: true,
    message: 'Editors retrieved successfully',
    data: {
      editors,
      count: editors.length,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role && ['client', 'editor', 'admin'].includes(role)) {
    filter.role = role;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users: users.map((u) => u.toSafeObject()),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (!['client', 'editor', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role provided');
  }

  if (id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot change your own role');
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const previousRole = user.role;
  user.role = role;
  await user.save();

  if (previousRole !== role) {
    await createNotification({
      recipient: user._id,
      sender: req.user._id,
      type: 'role_changed',
      title: 'Your account role was updated',
      message: `Your role has been changed from ${previousRole} to ${role} by an administrator.`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      user: user.toSafeObject(),
    },
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const { id } = req.params;

  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean value');
  }

  if (id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot change your own account status');
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isActive = isActive;
  await user.save();

  await createNotification({
    recipient: user._id,
    sender: req.user._id,
    type: 'account_status_changed',
    title: isActive ? 'Account reactivated' : 'Account deactivated',
    message: isActive
      ? 'Your account has been reactivated by an administrator.'
      : 'Your account has been deactivated by an administrator.',
  });

  res.status(200).json({
    success: true,
    message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      user: user.toSafeObject(),
    },
  });
});