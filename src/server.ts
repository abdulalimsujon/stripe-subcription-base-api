import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';
import app from './app';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

// Corrected typo: 'unhandleRejection' ➜ 'unhandledRejection'
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection detected:', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception detected:', error);
  process.exit(1);
});
