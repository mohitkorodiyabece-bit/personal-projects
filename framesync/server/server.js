import 'dotenv/config';
import dns from 'node:dns';

import app from './app.js';
import connectDB from './config/db.js';

// Use public DNS servers for MongoDB Atlas SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `FrameSync API server running in ${
          process.env.NODE_ENV || 'development'
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

if (process.env.VERCEL !== '1') {
  process.on('unhandledRejection', (error) => {
    console.error(`Unhandled Rejection: ${error.message}`);
  });

  startServer();
}

export default app;