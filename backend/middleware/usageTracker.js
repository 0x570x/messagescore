const { pool } = require('../db/connection');

const FREE_ANONYMOUS_LIMIT = parseInt(process.env.FREE_ANONYMOUS_LIMIT) || 3;
const FREE_EMAIL_LIMIT = parseInt(process.env.FREE_EMAIL_LIMIT) || 10;

async function usageTracker(req, res, next) {
  req.usageData = {
    fingerprint: req.headers['x-fingerprint'],
    ip: req.ip || req.headers['x-forwarded-for']?.split(',')[0],
    sessionId: req.headers['x-session-id'],
    userAgent: req.headers['user-agent']
  };
  next();
}

async function checkUsageLimit(req, res, next) {
  const { fingerprint, ip } = req.usageData;
  const userId = req.userId;

  try {
    if (userId) {
      const userResult = await pool.query(
        'SELECT is_pro, is_shadow_banned FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows[0]?.is_pro) {
        req.usageStatus = { allowed: true, isPro: true };
        return next();
      }

      if (userResult.rows[0]?.is_shadow_banned) {
        req.usageStatus = { allowed: true, shadowBanned: true };
        return next();
      }
    }

    let usageCount = 0;
    let hasEmail = !!userId;

    if (fingerprint) {
      const countResult = await pool.query(
        'SELECT COUNT(*) as count FROM usage_logs WHERE fingerprint = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [fingerprint]
      );
      usageCount = parseInt(countResult.rows[0].count);
    }

    if (userId) {
      const userCountResult = await pool.query(
        'SELECT COUNT(*) as count FROM usage_logs WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [userId]
      );
      usageCount = parseInt(userCountResult.rows[0].count);
    }

    const limit = hasEmail ? FREE_EMAIL_LIMIT : FREE_ANONYMOUS_LIMIT;
    const remaining = Math.max(0, limit - usageCount);

    req.usageStatus = {
      allowed: usageCount < limit,
      current: usageCount,
      limit: limit,
      remaining: remaining,
      requiresEmail: !hasEmail && usageCount >= FREE_ANONYMOUS_LIMIT,
      requiresUpgrade: hasEmail && usageCount >= FREE_EMAIL_LIMIT
    };

    if (!req.usageStatus.allowed) {
      return res.status(429).json({
        error: 'Usage limit reached',
        usageStatus: req.usageStatus
      });
    }

    next();
  } catch (error) {
    console.error('Usage tracking error:', error);
    req.usageStatus = { allowed: true, error: true };
    next();
  }
}

async function logUsage(req, scoreData) {
  const { fingerprint, ip, sessionId, userAgent } = req.usageData;
  const userId = req.userId;

  try {
    await pool.query(
      `INSERT INTO usage_logs 
       (user_id, fingerprint, ip_address, session_id, message_type, score, user_agent, suspicious_flags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId || null,
        fingerprint,
        ip,
        sessionId,
        scoreData.messageType,
        scoreData.score,
        userAgent,
        JSON.stringify(scoreData.suspiciousFlags || {})
      ]
    );

    if (fingerprint) {
      await pool.query(
        `INSERT INTO fingerprints (fingerprint_hash, usage_count, associated_ips, last_seen)
         VALUES ($1, 1, ARRAY[$2], NOW())
         ON CONFLICT (fingerprint_hash) 
         DO UPDATE SET 
           usage_count = fingerprints.usage_count + 1,
           last_seen = NOW()`,
        [fingerprint, ip]
      );
    }

    if (ip) {
      await pool.query(
        `INSERT INTO ip_tracking (ip_address, usage_count)
         VALUES ($1, 1)
         ON CONFLICT (ip_address)
         DO UPDATE SET usage_count = ip_tracking.usage_count + 1`,
        [ip]
      );
    }
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

module.exports = { usageTracker, checkUsageLimit, logUsage };