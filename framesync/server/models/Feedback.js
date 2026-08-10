import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    videoVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoVersion',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      trim: true,
      minlength: [2, 'Feedback message must be at least 2 characters'],
      maxlength: [1000, 'Feedback message cannot exceed 1000 characters'],
    },
    timestamp: {
      type: Number,
      required: [true, 'Timestamp is required'],
      min: [0, 'Timestamp cannot be negative'],
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ videoVersion: 1 });
feedbackSchema.index({ project: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;