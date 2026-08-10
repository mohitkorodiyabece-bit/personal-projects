import ApiError from '../utils/apiError.js';

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized, no user found on request');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Requires one of the following roles: ${roles.join(', ')}`
      );
    }

    next();
  };
};

export default authorize;