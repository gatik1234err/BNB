const express = require('express');
const cors = require('cors');
const marketsRouter = require('./routes/markets');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', marketsRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BNB Trading Terminal API running on http://localhost:${PORT}`);
});
