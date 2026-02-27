# BNB Terminal — Prediction Market Arbitrage Agent

A unified prediction market trading terminal with an AI-powered arbitrage detection agent. Aggregates data from **Manifold Markets** (live) and **5 simulated platforms** to detect mispricings and execute paper trades.

![Stack](https://img.shields.io/badge/React-18-blue) ![Stack](https://img.shields.io/badge/Express-4-green) ![Stack](https://img.shields.io/badge/Vite-5-purple)

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- npm

### 1. Install & Run Backend
```bash
cd server
npm install
npm run dev
```
Backend runs on **http://localhost:3001**

### 2. Install & Run Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

Open **http://localhost:5173** in your browser.

## 🏗 Architecture

```
BNB/
├── server/                    # Express API
│   ├── index.js               # Server entry
│   ├── routes/markets.js      # API endpoints
│   ├── services/
│   │   ├── manifold.js        # Live Manifold Markets API
│   │   └── mockLoader.js      # Mock data loader
│   ├── logic/arbitrage.js     # Arbitrage detection engine
│   └── data/mock/             # 5 mock platform JSONs
├── client/                    # Vite + React SPA
│   └── src/
│       ├── App.jsx            # Root layout
│       ├── components/        # UI components
│       └── hooks/useApi.js    # Data fetching hook
└── README.md
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/markets/live` | Live Manifold Markets data |
| GET | `/api/markets/mock` | All mock platform markets |
| GET | `/api/markets/all` | Combined live + mock |
| GET | `/api/arb` | Arbitrage opportunities |
| POST | `/api/trade` | Execute simulated trade |
| GET | `/api/portfolio` | Portfolio & trade history |

## 🤖 Arbitrage Logic

1. **Event Mapping**: Keywords match markets across platforms to the same real-world event
2. **Price Comparison**: For each event on ≥2 platforms, compare YES prices
3. **Threshold**: Flag if `|priceA - priceB| ≥ 5%`
4. **Output**: Suggested trades with estimated edge and profit

## 🎮 Demo Script (2-3 min)

1. Open the app → Show the **Unified Markets** table with 6 platforms
2. Filter by source → Show data from Manifold (live) vs mocked platforms
3. Scroll to **AI Arbitrage Agent** → Highlight detected mispricings
4. Click **Execute Simulated Trade** on a few opportunities
5. Show **Portfolio** panel updating with P&L chart
6. Explain: "One live feed + 5 mocked. Plug in any API to go live."

## 🔧 Configuration

No API keys required — Manifold Markets API is public. If the live API is unreachable, the app falls back to realistic demo data.

```bash
# Optional: change backend port
PORT=3001 node server/index.js
```

## 📝 Data Sources

| Platform | Type | Status |
|----------|------|--------|
| Manifold Markets | Live API | ✅ Active |
| Opinion | Mock JSON | 📦 Simulated |
| Predict.fun | Mock JSON | 📦 Simulated |
| Probable | Mock JSON | 📦 Simulated |
| XO | Mock JSON | 📦 Simulated |
| Bento | Mock JSON | 📦 Simulated |

---

Built for hackathon speed. 🚀
