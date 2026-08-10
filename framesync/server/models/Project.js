import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: 'Link',
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedEditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    videoType: {
      type: String,
      required: [true, 'Video type is required'],
      enum: {
        values: [
          'youtube',
          'short_form',
          'commercial',
          'wedding',
          'corporate',
          'music_video',
          'documentary',
          'social_media',
          'other',
        ],
        message: 'Invalid video type',
      },
    },
    editingStyle: {
      type: String,
      required: [true, 'Editing style is required'],
      trim: true,
      maxlength: [120, 'Editing style cannot exceed 120 characters'],
    },
    status: {
      type: String,
      enum: {
        values: [
          'created',
          'files_submitted',
          'assigned',
          'editing',
          'preview_ready',
          'client_review',
          'revision_requested',
          'final_ready',
          'approved',
          'completed',
          'cancelled',
        ],
        message: 'Invalid project status',
      },
      default: 'created',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Invalid priority level',
      },
      default: 'medium',
    },
    revisionLimit: {
      type: Number,
      required: [true, 'Revision limit is required'],
      min: [0, 'Revision limit cannot be negative'],
      max: [20, 'Revision limit cannot exceed 20'],
      default: 3,
    },
    revisionsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    rawFileLinks: {
      type: [linkSchema],
      default: [],
    },
    referenceLinks: {
      type: [linkSchema],
      default: [],
    },
    thumbnail: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    finalDeliveryLink: {
      type: String,
      trim: true,
      default: '',
    },
    finalApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ client: 1 });
projectSchema.index({ assignedEditor: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ deadline: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;