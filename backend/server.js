const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { usageTracker } = require('./middleware/usageTracker');
const { authMiddleware } = require('./middleware/authMiddleware');
const rateLimiterMiddleware = require('./middleware/rateLimiter');

const evaluateRouter = require('./routes/evaluate');
const authRouter = require('./routes/auth');
const stripeRouter = require('./routes/stripe');
const adminRouter = require('./routes/admin');

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use(usageTracker);
app.use(authMiddleware);
app.use(rateLimiterMiddleware);

app.use('/api', evaluateRouter);
app.use('/api/auth', authRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/admin', adminRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ MessageScore API running on port ${PORT}`);
});