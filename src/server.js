require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { startCronJobs } = require('./config/cronJobs');

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TRAIL API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  // Start background jobs (only in production/development — not in test)
  if (process.env.NODE_ENV !== 'test') {
    startCronJobs();
  }
}

startServer();
