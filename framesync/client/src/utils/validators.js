export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
};

export const isValidPassword = (password) => {
  if (!password || password.length < 8) return false;
  if (!/\d/.test(password)) return false;
  if (!/[a-zA-Z]/.test(password)) return false;
  return true;
};

export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isNonEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const validateProjectForm = (form) => {
  const errors = {};

  if (!isNonEmpty(form.title) || form.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  if (!isNonEmpty(form.description) || form.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  if (!form.deadline) {
    errors.deadline = 'Deadline is required';
  } else if (new Date(form.deadline) < new Date().setHours(0, 0, 0, 0)) {
    errors.deadline = 'Deadline cannot be in the past';
  }
  if (!form.budget || Number(form.budget) <= 0) {
    errors.budget = 'Budget must be a positive number';
  }
  if (!isNonEmpty(form.videoType)) {
    errors.videoType = 'Video type is required';
  }
  if (!isNonEmpty(form.editingStyle)) {
    errors.editingStyle = 'Editing style is required';
  }
  if (
    form.revisionLimit !== undefined &&
    form.revisionLimit !== '' &&
    (Number(form.revisionLimit) < 0 || Number(form.revisionLimit) > 20)
  ) {
    errors.revisionLimit = 'Revision limit must be between 0 and 20';
  }

  return errors;
};

export const validateRegisterForm = (form) => {
  const errors = {};

  if (!isNonEmpty(form.name) || form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!isValidEmail(form.email)) {
    errors.email = 'Please provide a valid email address';
  }
  if (!isValidPassword(form.password)) {
    errors.password = 'Password must be at least 8 characters with letters and numbers';
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = (form) => {
  const errors = {};

  if (!isValidEmail(form.email)) {
    errors.email = 'Please provide a valid email address';
  }
  if (!isNonEmpty(form.password)) {
    errors.password = 'Password is required';
  }

  return errors;
};