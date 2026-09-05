const express = require('express');
const { verifyJwt } = require('../../middleware/auth');
const allowRoles = require('../../middleware/allowRoles');
const { syncLocalToNeon } = require('../../services/dbSync');

const router = express.Router();

router.post('/neon', verifyJwt, allowRoles('admin'), async (req, res) => {
  try {
    const result = await syncLocalToNeon();
    return res.status(200).json({
      message: 'Local database synchronized to Neon successfully.',
      ...result,
    });
  } catch (error) {
    console.error('[DB Sync] Manual Neon sync failed:', error);
    return res.status(502).json({
      message: error.message || 'Unable to synchronize with Neon.',
    });
  }
});

module.exports = router;