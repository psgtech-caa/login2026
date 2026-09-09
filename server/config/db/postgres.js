const { Sequelize } = require("sequelize");
const path = require("path");
require("pg"); // Force Vercel bundler to include 'pg' module for Sequelize

let activeSequelize;
let neonSequelize;

function createPostgresInstance(connString) {
  if (!connString) return null;
  return new Sequelize(connString, {
    dialect: "postgres",
    logging: false,
    dialectOptions: (process.env.NODE_ENV === "production" || connString.includes("neon.tech")) && !connString.includes("localhost") ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      family: 4,
      connectTimeout: 5000
    } : {
      connectTimeout: 5000
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 10000,
      idle: 10000
    }
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

activeSequelize = forceSqlite ? createSqliteInstance() : createPostgresInstance(localDbConn);
neonSequelize = createPostgresInstance(neonDbConn);

const sequelizeProxy = new Proxy({}, {
  get(target, prop) {
    const val = activeSequelize[prop];
    if (typeof val === 'function') {
      return val.bind(activeSequelize);
    }
    return val;
  },
  set(target, prop, value) {
    activeSequelize[prop] = value;
    return true;
  }
});

const connectPostgres = async () => {
  let retries = 2;
  while (retries > 0) {
    try {
      await activeSequelize.authenticate();
      console.log(`Local Database connected successfully using ${activeSequelize.getDialect()}`);
      break;
    } catch (error) {
      retries -= 1;
      if (retries === 0) {
        console.warn("PostgreSQL connection failed. Falling back to local SQLite database.");
        try {
          const oldSequelize = activeSequelize;
          activeSequelize = createSqliteInstance();
          if (oldSequelize && oldSequelize.models) {
            Object.values(oldSequelize.models).forEach((model) => {
              model.sequelize = activeSequelize;
              model.queryInterface = activeSequelize.getQueryInterface();
              if (activeSequelize.modelManager) {
                activeSequelize.modelManager.addModel(model);
              }
            });
          }
          await activeSequelize.authenticate();
          await activeSequelize.sync();
          console.log("Fallback Database connected successfully using sqlite");
          break;
        } catch (sqliteErr) {
          console.error("PostgreSQL and SQLite connections failed.", sqliteErr.message);
          throw error;
        }
      }
      console.warn(`Database connection attempt failed (${error.message}). Retrying in 1 second... (${retries} attempts left)`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const connectNeonOnBoot = ['true', '1', 'yes', 'on'].includes(
    String(process.env.CONNECT_NEON_ON_BOOT || '').toLowerCase()
  );

  if (neonSequelize && connectNeonOnBoot) {
    try {
      await neonSequelize.authenticate();
      console.log(`Neon Database connected successfully using postgres`);
    } catch (neonError) {
      console.warn("Neon Database connection failed; continuing with main Postgres.", neonError.message);
    }
  } else if (neonSequelize) {
    console.log('Neon connection on startup is disabled; Neon is available for manual sync only.');
  }
};

module.exports = { connectPostgres, sequelize: sequelizeProxy, neonSequelize };
