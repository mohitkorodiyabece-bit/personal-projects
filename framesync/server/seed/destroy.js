import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import VideoVersion from '../models/VideoVersion.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';

const log = (msg) => console.log(`[destroy] ${msg}`);

const runDestroy = async () => {
  await connectDB();

  log('Removing all seed data...');

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    VideoVersion.deleteMany({}),
    Feedback.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  log('All collections cleared.');

  await mongoose.connection.close();
  process.exit(0);
};

runDestroy().catch((error) => {
  console.error(`Destroy failed: ${error.message}`);
  process.exit(1);
});