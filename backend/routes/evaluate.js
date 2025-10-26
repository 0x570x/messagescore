const express = require('express');
const router = express.Router();
const { checkUsageLimit, logUsage } = require('../middleware/usageTracker');
const { calculateRiskScore } = require('../middleware/antiAbuse');

router.post('/evaluate', checkUsageLimit, async (req, res) => {
  try {
    const { prompt, messageType } = req.body;
    
    if (req.usageStatus?.shadowBanned) {
      return res.json({
        content: [{
          text: JSON.stringify({
            clarity_score: 7,
            verifiability_score: 6,
            trust_score: 7,
            total_score: 67,
            clarity_feedback: "Message structure is acceptable.",
            verifiability_feedback: "Could benefit from more specific details.",
            trust_feedback: "Generally credible tone.",
            improvements: ["Add specific metrics", "Include customer testimonials"]
          })
        }]
      });
    }

    const { riskScore, botFlags } = await calculateRiskScore(req);

    if (riskScore >= 40) {
      req.usageStatus.requiresEmail = true;
    }

    // TIERED MODEL SYSTEM
    let model = "claude-3-haiku-20240307"; // Default: Anonymous users (Tier 1)
    let modelTier = "free";

    if (req.usageStatus?.isPro) {
      model = "claude-sonnet-4-20250514"; // Pro users (Tier 3)
      modelTier = "pro";
    } else if (req.userId) {
      model = "claude-sonnet-4-20250514"; // Verified email users (Tier 2)
      modelTier = "verified";
    }

    console.log(`Using ${model} for ${modelTier} user`);

   const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    // Check if the API returned an error
    if (data.error) {
      console.error('Anthropic API Error:', data.error);
      return res.status(500).json({ error: `API Error: ${data.error.message}` });
    }

    // Check if we got the expected response
    if (!data.content || !data.content[0]) {
      console.error('Unexpected API response:', data);
      return res.status(500).json({ error: 'Unexpected API response format' });
    }
    const resultText = data.content[0].text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(resultText);

    await logUsage(req, {
      messageType: messageType,
      score: parsedResult.total_score,
      suspiciousFlags: botFlags
    });

    res.json({
      ...data,
      usageStatus: req.usageStatus,
      modelUsed: model // Send back which model was used
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

router.get('/usage-status', async (req, res) => {
  const { pool } = require('../db/connection');
  const { fingerprint } = req.usageData;
  const userId = req.userId;

  try {
    let usageCount = 0;
    let hasEmail = !!userId;

    if (fingerprint) {
      const result = await pool.query(
        'SELECT COUNT(*) as count FROM usage_logs WHERE fingerprint = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [fingerprint]
      );
      usageCount = parseInt(result.rows[0].count);
    }

    if (userId) {
      const result = await pool.query(
        'SELECT COUNT(*) as count FROM usage_logs WHERE user_id = $1 AND created_at > NOW() - INTERVAL \'30 days\'',
        [userId]
      );
      usageCount = parseInt(result.rows[0].count);
    }

    const FREE_ANONYMOUS_LIMIT = parseInt(process.env.FREE_ANONYMOUS_LIMIT) || 3;
    const FREE_EMAIL_LIMIT = parseInt(process.env.FREE_EMAIL_LIMIT) || 10;
    const limit = hasEmail ? FREE_EMAIL_LIMIT : FREE_ANONYMOUS_LIMIT;
    
    res.json({
      current: usageCount,
      limit: limit,
      remaining: Math.max(0, limit - usageCount),
      requiresEmail: !hasEmail && usageCount >= FREE_ANONYMOUS_LIMIT,
      requiresUpgrade: hasEmail && usageCount >= FREE_EMAIL_LIMIT
    });
  } catch (error) {
    console.error('Error fetching usage status:', error);
    res.status(500).json({ error: 'Failed to fetch usage status' });
  }
});

module.exports = router;