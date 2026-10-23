require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const budgetRoutes = require('./routes/budget');
const { protect } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/budget', budgetRoutes);

app.get('/api/protected-demo', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected route reached',
    user: req.user,
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SubSense Backend is running',
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SubSense API is running',
  });
});

connectDB();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
