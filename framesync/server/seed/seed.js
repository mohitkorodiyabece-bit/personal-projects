import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import VideoVersion from '../models/VideoVersion.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';

const DEMO_PASSWORD = 'Demo@12345';

const log = (msg) => console.log(`[seed] ${msg}`);

const runSeed = async () => {
  await connectDB();

  log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    VideoVersion.deleteMany({}),
    Feedback.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  log('Creating users...');

  const admin = await User.create({
    name: 'Alex Morgan',
    email: 'admin@framesync.demo',
    password: DEMO_PASSWORD,
    role: 'admin',
    bio: 'Platform administrator overseeing FrameSync operations.',
  });

  const client1 = await User.create({
    name: 'Priya Sharma',
    email: 'client1@framesync.demo',
    password: DEMO_PASSWORD,
    role: 'client',
    bio: 'Marketing lead at a growing D2C brand, frequently commissions promo videos.',
  });

  const client2 = await User.create({
    name: 'Daniel Reyes',
    email: 'client2@framesync.demo',
    password: DEMO_PASSWORD,
    role: 'client',
    bio: 'Independent filmmaker working on documentary shorts.',
  });

  const editor1 = await User.create({
    name: 'Jordan Lee',
    email: 'editor1@framesync.demo',
    password: DEMO_PASSWORD,
    role: 'editor',
    bio: 'Senior video editor specializing in commercial and social content.',
    skills: ['Premiere Pro', 'Color Grading', 'Motion Graphics', 'Sound Design'],
  });

  const editor2 = await User.create({
    name: 'Sam Okafor',
    email: 'editor2@framesync.demo',
    password: DEMO_PASSWORD,
    role: 'editor',
    bio: 'Documentary and long-form editor with a focus on narrative pacing.',
    skills: ['DaVinci Resolve', 'Storytelling', 'Audio Mixing'],
  });

  log('Creating projects...');

  const project1 = await Project.create({
    title: 'Summer Product Launch Promo',
    description: 'A 60-second promotional video for our new summer product line, targeting Instagram and YouTube Shorts audiences.',
    client: client1._id,
    assignedEditor: editor1._id,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    budget: 1200,
    videoType: 'short_form',
    editingStyle: 'Fast-paced, vibrant, trending audio sync',
    status: 'client_review',
    priority: 'high',
    revisionLimit: 3,
    revisionsUsed: 1,
    rawFileLinks: [
      { label: 'Raw Footage Drive', url: 'https://drive.google.com/drive/folders/example-summer-launch' },
    ],
    referenceLinks: [
      { label: 'Style Reference Video', url: 'https://www.youtube.com/watch?v=example-ref-1' },
    ],
  });

  const project2 = await Project.create({
    title: 'Downtown Documentary Trailer',
    description: 'A 90-second trailer cut from raw interview footage for a documentary about urban revitalization projects.',
    client: client2._id,
    assignedEditor: editor2._id,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    budget: 2500,
    videoType: 'documentary',
    editingStyle: 'Cinematic, contemplative, natural sound design',
    status: 'editing',
    priority: 'medium',
    revisionLimit: 4,
    revisionsUsed: 0,
    rawFileLinks: [
      { label: 'Interview Footage', url: 'https://www.dropbox.com/scl/example-documentary-footage' },
    ],
    referenceLinks: [],
  });

  const project3 = await Project.create({
    title: 'Corporate Onboarding Video',
    description: 'An internal onboarding video introducing new hires to company culture, values, and key team members.',
    client: client1._id,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    budget: 800,
    videoType: 'corporate',
    editingStyle: 'Clean, professional, on-brand graphics',
    status: 'created',
    priority: 'low',
    revisionLimit: 2,
    rawFileLinks: [],
    referenceLinks: [],
  });

  const project4 = await Project.create({
    title: 'Wedding Highlight Reel — Reyes/Chen',
    description: 'A 4-minute cinematic wedding highlight reel combining ceremony and reception footage.',
    client: client2._id,
    assignedEditor: editor1._id,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    budget: 1500,
    videoType: 'wedding',
    editingStyle: 'Romantic, warm color grade, emotional pacing',
    status: 'completed',
    priority: 'medium',
    revisionLimit: 3,
    revisionsUsed: 2,
    finalDeliveryLink: 'https://drive.google.com/file/d/example-final-wedding-reel',
    finalApproved: true,
    rawFileLinks: [
      { label: 'Ceremony Footage', url: 'https://drive.google.com/drive/folders/example-wedding-ceremony' },
      { label: 'Reception Footage', url: 'https://drive.google.com/drive/folders/example-wedding-reception' },
    ],
    referenceLinks: [],
  });

  log('Creating sample video versions...');

  const version1 = await VideoVersion.create({
    project: project1._id,
    versionNumber: 1,
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/elephants.mp4',
    publicId: 'samples/elephants',
    uploadedBy: editor1._id,
    notes: 'First cut with rough color grade. Music sync still needs refinement in the second half.',
    duration: 45,
    approved: false,
  });

  const version2 = await VideoVersion.create({
    project: project4._id,
    versionNumber: 1,
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/sea-turtle.mp4',
    publicId: 'samples/sea-turtle',
    uploadedBy: editor1._id,
    notes: 'Initial cut of the ceremony highlights.',
    duration: 120,
    approved: true,
  });

  log('Creating sample feedback...');

  await Feedback.create({
    project: project1._id,
    videoVersion: version1._id,
    author: client1._id,
    message: 'Love the energy here, but can we swap the transition at this point for something less abrupt?',
    timestamp: 12.5,
    resolved: false,
  });

  await Feedback.create({
    project: project1._id,
    videoVersion: version1._id,
    author: client1._id,
    message: 'The logo reveal timing feels perfect right here — keep this exactly as is.',
    timestamp: 38.2,
    resolved: true,
    resolvedBy: editor1._id,
  });

  log('Creating sample notifications...');

  await Notification.create([
    {
      recipient: editor1._id,
      sender: client1._id,
      type: 'feedback_added',
      title: 'New feedback comment',
      message: 'Priya Sharma left feedback on "Summer Product Launch Promo" (v1)',
      relatedProject: project1._id,
      isRead: false,
    },
    {
      recipient: client1._id,
      sender: editor1._id,
      type: 'version_uploaded',
      title: 'New preview version uploaded',
      message: 'Version 1 of "Summer Product Launch Promo" is ready to review',
      relatedProject: project1._id,
      isRead: true,
    },
    {
      recipient: editor2._id,
      sender: admin._id,
      type: 'project_assigned',
      title: 'New project assigned to you',
      message: 'You have been assigned to work on "Downtown Documentary Trailer"',
      relatedProject: project2._id,
      isRead: false,
    },
  ]);

  log('Seed complete!');
  log('----------------------------------------');
  log('DEMO CREDENTIALS (all use the same password)');
  log(`Password for all accounts: ${DEMO_PASSWORD}`);
  log('----------------------------------------');
  log(`Admin:    admin@framesync.demo`);
  log(`Client 1: client1@framesync.demo (Priya Sharma)`);
  log(`Client 2: client2@framesync.demo (Daniel Reyes)`);
  log(`Editor 1: editor1@framesync.demo (Jordan Lee)`);
  log(`Editor 2: editor2@framesync.demo (Sam Okafor)`);
  log('----------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
};

runSeed().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
});