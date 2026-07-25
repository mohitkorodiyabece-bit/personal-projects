import cloudinary from '../config/cloudinary.js';
import ApiError from '../utils/apiError.js';

const bufferToDataUri = (file) => {
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
};

export const uploadImageToCloudinary = async (file, folder) => {
  if (!file) {
    throw new ApiError(400, 'No file provided for upload');
  }

  try {
    const dataUri = bufferToDataUri(file);
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `framesync/${folder}`,
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new ApiError(500, `Image upload failed: ${error.message}`);
  }
};

export const uploadVideoToCloudinary = async (file, folder) => {
  if (!file) {
    throw new ApiError(400, 'No file provided for upload');
  }

  try {
    const dataUri = bufferToDataUri(file);
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `framesync/${folder}`,
      resource_type: 'video',
      chunk_size: 6000000,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration || 0,
    };
  } catch (error) {
    throw new ApiError(500, `Video upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}: ${error.message}`);
  }
};