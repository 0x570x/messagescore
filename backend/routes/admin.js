const express = require('express');
const router = express.Router();
const { pool } = require('../db/connection');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.use(async (req, res, next) => {
  const adminCheck = await pool.query(
    'SELECT id FROM admin_users WHERE id = $1',
    [req.userId]
  );
  
  if (adminCheck.rows.length === 0) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  req.isAdmin = true;
  next();
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE is_pro = true) as pro_users,
        (SELECT COUNT(*) FROM users WHERE email_verified = true) as verified_users,
        (SELECT COUNT(*) FROM usage_logs WHERE created_at > NOW() - INTERVAL '24 hours') as scores_today,
        (SELECT COUNT(*) FROM usage_logs WHERE created_at > NOW() - INTERVAL '7 days') as scores_week,
        (SELECT COUNT(*) FROM fingerprints WHERE is_blocked = true) as blocked_fingerprints,
        (SELECT COUNT(*) FROM users WHERE is_shadow_banned = true) as shadow_banned_users
    `);

    res.json(stats.rows[0]);

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/high-risk-users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.fingerprint_hash,
        f.risk_score,
        f.usage_count,
        f.is_blocked,
        f.last_seen,
        array_length(f.associated_ips, 1) as ip_count,
        f.associated_emails
      FROM fingerprints f
      WHERE f.risk_score >= 30
      ORDER BY f.risk_score DESC
      LIMIT 100
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('High risk users error:', error);
    res.status(500).json({ error: 'Failed to fetch high risk users' });
  }
});

router.post('/block-fingerprint', async (req, res) => {
  const { fingerprint } = req.body;

  try {
    await pool.query(
      'UPDATE fingerprints SET is_blocked = true WHERE fingerprint_hash = $1',
      [fingerprint]
    );

    res.json({ success: true, message: 'Fingerprint blocked' });

  } catch (error) {
    console.error('Block fingerprint error:', error);
    res.status(500).json({ error: 'Failed to block fingerprint' });
  }
});

module.exports = router;