require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { sequelize } = require('../config/db/postgres');

const migrate = async () => {
  await sequelize.authenticate();
  await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);');
  await sequelize.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_unique ON users (google_id) WHERE google_id IS NOT NULL;'
  );
  console.log('Google account linkage migration completed.');
};

migrate()
  .catch((error) => {
    console.error('Google account linkage migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
