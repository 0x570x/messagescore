const express = require('express');
const router = express.Router();
const { pool } = require('../db/connection');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/emailService');
const { isDisposableEmail, calculateRiskScore } = require('../middleware/antiAbuse');
const crypto = require('crypto');

router.post('/signup', async (req, res) => {
  const { email } = req.body;
  const { fingerprint, ip } = req.usageData;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ 
        error: 'Temporary email addresses are not supported. Please use a permanent email address.' 
      });
    }

    const { riskScore } = await calculateRiskScore(req);

    const existing = await pool.query(
      'SELECT id, email_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    let userId;

    if (existing.rows.length > 0) {
      userId = existing.rows[0].id;
      
      if (existing.rows[0].email_verified) {
        const token = generateToken(userId, email);
        return res.json({
          success: true,
          token,
          verified: true,
          message: 'Welcome back!'
        });
      }
    } else {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const result = await pool.query(
        `INSERT INTO users (email, verification_token, verification_expires, risk_score, is_shadow_banned) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [email.toLowerCase(), verificationToken, verificationExpires, riskScore, riskScore >= 50]
      );
      userId = result.rows[0].id;

      const emailSent = await sendVerificationEmail(email, verificationToken);
      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send verification email' });
      }

      if (fingerprint) {
        await pool.query(
          `UPDATE fingerprints 
           SET associated_emails = array_append(associated_emails, $1)
           WHERE fingerprint_hash = $2`,
          [email.toLowerCase(), fingerprint]
        );
      }
    }

    const tempToken = generateToken(userId, email);

    res.json({
      success: true,
      token: tempToken,
      verified: false,
      needsVerification: true,
      message: 'Check your email to verify and unlock 7 more free scores!'
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, email, verification_expires 
       FROM users 
       WHERE verification_token = $1 AND email_verified = false`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification link' });
    }

    const user = result.rows[0];

    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ error: 'Verification link expired. Request a new one.' });
    }

    await pool.query(
      `UPDATE users 
       SET email_verified = true, verification_token = NULL, verification_expires = NULL
       WHERE id = $1`,
      [user.id]
    );

    const authToken = generateToken(user.id, user.email);

    res.json({
      success: true,
      token: authToken,
      message: '✓ Email verified! 7 more free scores unlocked.'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, email_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    if (result.rows[0].email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE users 
       SET verification_token = $1, verification_expires = $2
       WHERE email = $3`,
      [verificationToken, verificationExpires, email.toLowerCase()]
    );

    await sendVerificationEmail(email, verificationToken);

    res.json({ success: true, message: 'Verification email sent!' });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification' });
  }
});

router.get('/user/status', async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const result = await pool.query(
      'SELECT email_verified, is_pro FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('User status error:', error);
    res.status(500).json({ error: 'Failed to fetch user status' });
  }
});

module.exports = router;