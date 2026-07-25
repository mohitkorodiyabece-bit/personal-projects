import ApiError from './apiError.js';

export const isProjectOwner = (project, userId) => {
  return project.client.toString() === userId.toString();
};

export const isAssignedEditor = (project, userId) => {
  return (
    project.assignedEditor &&
    project.assignedEditor.toString() === userId.toString()
  );
};

export const canViewProject = (project, user) => {
  if (user.role === 'admin') return true;
  if (user.role === 'client') return isProjectOwner(project, user._id);
  if (user.role === 'editor') return isAssignedEditor(project, user._id);
  return false;
};

export const assertCanViewProject = (project, user) => {
  if (!canViewProject(project, user)) {
    throw new ApiError(403, 'You are not authorized to access this project');
  }
};

export const assertIsProjectOwner = (project, user) => {
  if (user.role === 'admin') return;
  if (!isProjectOwner(project, user._id)) {
    throw new ApiError(
      403,
      'Only the project client can perform this action'
    );
  }
};

export const assertIsAssignedEditor = (project, user) => {
  if (user.role === 'admin') return;
  if (!isAssignedEditor(project, user._id)) {
    throw new ApiError(
      403,
      'Only the assigned editor can perform this action'
    );
  }
};