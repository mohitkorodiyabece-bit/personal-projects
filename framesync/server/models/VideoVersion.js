import mongoose from 'mongoose';

const videoVersionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

videoVersionSchema.index({ project: 1, versionNumber: 1 }, { unique: true });

const VideoVersion = mongoose.model('VideoVersion', videoVersionSchema);

export default VideoVersion;