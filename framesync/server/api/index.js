import dotenv from 'dotenv';
dotenv.config();

import app from '../app.js';
import connectDB from '../config/db.js';

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};

export default handler;