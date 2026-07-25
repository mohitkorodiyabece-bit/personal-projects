import multer from 'multer';
import ApiError from '../utils/apiError.js';

const storage = multer.memoryStorage();

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const videoMimeTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'avatar' || file.fieldname === 'thumbnail') {
    if (imageMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new ApiError(400, 'Only JPEG, PNG, or WEBP images are allowed for this field'),
      false
    );
  }

  if (file.fieldname === 'video') {
    if (videoMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new ApiError(400, 'Only MP4, MOV, WEBM, or MKV video files are allowed'),
      false
    );
  }

  return cb(new ApiError(400, 'Unexpected file field'), false);
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large';
    }
    return res.status(400).json({
      success: false,
      message,
      errors: [],
    });
  }
  next(err);
};