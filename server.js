const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const analyzeRoute = require('./routes/analyzeRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting: Max 5 requests per IP per hour
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    error: "Kamu telah mencapai batas analisa hari ini. Coba lagi dalam 1 jam."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/analyze', apiLimiter, analyzeRoute);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Terjadi kesalahan pada server. Silakan coba lagi." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
