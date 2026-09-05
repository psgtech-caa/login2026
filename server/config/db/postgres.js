const { Sequelize } = require("sequelize");
const path = require("path");
require("pg"); // Force Vercel bundler to include 'pg' module for Sequelize

let sequelize;
let neonSequelize;

function createPostgresInstance(connString) {
  if (!connString) return null;
  return new Sequelize(connString, {
    dialect: "postgres",
    logging: false,
    dialectOptions: process.env.NODE_ENV === "production" && !connString.includes("localhost") ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  });
}

function createSqliteInstance() {
  const dbPath = process.env.SQLITE_PATH || path.resolve(__dirname, "../../login.sqlite");
  return new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false,
  });
}

const forceSqlite = process.env.USE_SQLITE === "true";

const localDbConn = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL || process.env.DBCONN;
const neonDbConn = process.env.NEON_DATABASE_URL;

if (!localDbConn && !forceSqlite) {
  throw new Error("LOCAL_DATABASE_URL or DATABASE_URL is not set.");
}

sequelize = forceSqlite ? createSqliteInstance() : createPostgresInstance(localDbConn);
neonSequelize = createPostgresInstance(neonDbConn);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Local Database connected successfully using ${sequelize.getDialect()}`);

    const connectNeonOnBoot = ['true', '1', 'yes', 'on'].includes(
      String(process.env.CONNECT_NEON_ON_BOOT || '').toLowerCase()
    );

    if (neonSequelize && connectNeonOnBoot) {
      try {
        await neonSequelize.authenticate();
        console.log(`Neon Database connected successfully using postgres`);
      } catch (neonError) {
        console.warn("Neon Database connection failed; continuing with local Docker Postgres.", neonError.message);
      }
    } else if (neonSequelize) {
      console.log('Neon connection on startup is disabled; Neon is available for manual sync only.');
    }
  } catch (error) {
    if (forceSqlite) {
      throw error;
    }
    console.error("PostgreSQL connection failed. Check LOCAL_DATABASE_URL / NEON_DATABASE_URL.");
    throw error;
  }
};

module.exports = { connectPostgres, sequelize, neonSequelize };
