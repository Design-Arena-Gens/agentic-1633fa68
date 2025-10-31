# MeeshoLens 🔍

Real-time, mobile-first web tool that analyzes Meesho product links and provides live insights.

## Features

- ✅ Real-time product data fetching
- ✅ AI-powered sentiment analysis
- ✅ Price trend tracking (1M / 6M / Lifetime)
- ✅ Review analysis and insights
- ✅ Buyer behavior patterns
- ✅ Revenue estimation
- ✅ Mobile-first responsive design
- ✅ Dark mode by default

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes (Serverless)
- **Scraping**: Cheerio (Playwright can be added for advanced scraping)
- **AI**: OpenAI GPT-4o-mini
- **Database**: Supabase (PostgreSQL)
- **Cache**: Upstash Redis

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `OPENAI_API_KEY`: OpenAI API key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `UPSTASH_REDIS_URL`: Upstash Redis URL
- `UPSTASH_REDIS_TOKEN`: Upstash Redis token

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Deploy to Vercel:
```bash
vercel deploy --prod --yes
```

## API Endpoints

### POST /api/analyze
Start analysis job for a Meesho product URL.

**Request:**
```json
{
  "url": "https://www.meesho.com/..."
}
```

**Response:**
```json
{
  "jobId": "job-1234567890",
  "status": "started"
}
```

### GET /api/status/:jobId
Check job status and progress.

**Response:**
```json
{
  "id": "job-1234567890",
  "status": "analyzing",
  "progress": 50,
  "message": "Analyzing reviews..."
}
```

### GET /api/results/:jobId?range=1m|6m|life
Get analysis results with optional time range filter.

**Response:**
```json
{
  "product": { ... },
  "reviews": [ ... ],
  "priceHistory": [ ... ],
  "insights": { ... }
}
```

## Architecture

```
┌─────────────┐
│   Next.js   │
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────┐
│  API Routes │────▶│  Scraper │
│  (Vercel)   │     │ (Cheerio)│
└──────┬──────┘     └────┬─────┘
       │                 │
       ▼                 ▼
┌─────────────┐     ┌──────────┐
│   Redis     │     │  OpenAI  │
│   Cache     │     │    AI    │
└─────────────┘     └──────────┘
       │
       ▼
┌─────────────┐
│  Supabase   │
│  Database   │
└─────────────┘
```

## Database Schema

### products
- id (primary key)
- url (unique)
- title
- category
- image
- seller
- price
- originalPrice
- discount
- rating
- ratingCount
- stock
- createdAt

### reviews
- id (primary key)
- productId (foreign key)
- rating
- text
- date
- verified
- sentiment
- topics (JSON)

### price_history
- id (primary key)
- productId (foreign key)
- price
- timestamp

### jobs
- id (primary key)
- productId (foreign key)
- status
- progress
- message
- startedAt
- completedAt

## Legal & Privacy

- Data is fetched from publicly available sources
- No user data is stored without consent
- Revenue estimates are approximate and for informational purposes only
- Respects robots.txt and rate limiting
- User-initiated scraping only (no bulk crawling)

## Performance

- Redis caching: 15-minute cache for repeated queries
- Serverless functions with auto-scaling
- Mobile-optimized assets
- Real-time progress updates via polling

## Future Enhancements

- [ ] WebSocket support for instant updates
- [ ] Playwright for advanced scraping
- [ ] PDF report generation
- [ ] Product comparison feature
- [ ] Historical analysis tracking
- [ ] Export data feature

## License

MIT

---

Built with ❤️ using Next.js and Claude Code
