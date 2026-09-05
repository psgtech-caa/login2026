const path = require('path');

const repoEnvPath = path.resolve(__dirname, '../.env');
const serverEnvPath = path.resolve(__dirname, '.env');
require('dotenv').config({ path: repoEnvPath });
require('dotenv').config({ path: serverEnvPath });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'REPLACE_WITH_64_CHAR_RANDOM_HEX') {
  console.error('FATAL: JWT_SECRET is not configured. Set a strong random secret in .env');
  process.exit(1);
}
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'REPLACE_WITH_64_CHAR_RANDOM_HEX') {
  console.error('FATAL: SESSION_SECRET is not configured. Set a strong random secret in .env');
  process.exit(1);
}
process.env.FRONTEND_URL = (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes("vercel.app")) 
  ? process.env.FRONTEND_URL 
  : "https://login.psgtech.ac.in";

const app = require("./app");
const { connectPostgres } = require("./config/db/postgres");
require("./models/postgres");

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectPostgres();

    console.log('Database startup mutations are disabled; preserving existing database data.');

    app.listen(PORT, () => {
      console.log(`LOGIN 2026 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
