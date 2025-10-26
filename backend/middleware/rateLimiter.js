const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 20,
  duration: 900,
});

const rateLimiterMiddleware = async (req, res, next) => {
  const key = req.usageData?.fingerprint || req.usageData?.ip || 'anonymous';
  
  try {
    await rateLimiter.consume(key);
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Too many requests. Please slow down.',
      retryAfter: Math.round(error.msBeforeNext / 1000)
    });
  }
};

module.exports = rateLimiterMiddleware;