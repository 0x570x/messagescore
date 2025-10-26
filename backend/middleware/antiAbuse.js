const UAParser = require('ua-parser-js');
const { pool } = require('../db/connection');

const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'throwaway.email', 'mailinator.com', 'trashmail.com',
  'yopmail.com', 'fakeinbox.com', 'sharklasers.com'
];

function isDisposableEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.some(d => domain?.includes(d));
}

async function calculateRiskScore(req) {
  const { fingerprint, ip } = req.usageData;
  let riskScore = 0;

  try {
    if (fingerprint) {
      const ipCount = await pool.query(
        `SELECT COUNT(DISTINCT ip_address) as count 
         FROM usage_logs 
         WHERE fingerprint = $1`,
        [fingerprint]
      );
      
      if (ipCount.rows[0].count > 3) {
        riskScore += 20;
      }
    }

    if (ip) {
      const fpCount = await pool.query(
        `SELECT COUNT(DISTINCT fingerprint) as count 
         FROM usage_logs 
         WHERE ip_address = $1`,
        [ip]
      );
      
      if (fpCount.rows[0].count > 5) {
        riskScore += 25;
      }
    }

    return { riskScore, botFlags: {} };
  } catch (error) {
    console.error('Risk calculation error:', error);
    return { riskScore: 0, botFlags: {} };
  }
}

module.exports = {
  isDisposableEmail,
  calculateRiskScore
};