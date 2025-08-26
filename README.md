# D2R Holy Grail Web Tracker

A web application for sharing and tracking Diablo II: Resurrected Holy Grail progress with achievements, leaderboards, and real-time sync from the desktop client.

## Features

- 🏆 **Achievement System** - Unlock milestones and special achievements
- 📊 **Leaderboards** - Compare your progress with other players  
- 📈 **Real-time Sync** - Automatic progress updates from desktop app
- 🎮 **Player Profiles** - Public profiles with detailed statistics
- 📱 **Responsive Design** - Works on desktop and mobile
- 🌙 **Dark Theme** - Matches the desktop app's Diablo-inspired design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Material-UI
- **Backend**: Next.js API Routes, PostgreSQL, Prisma ORM
- **Authentication**: API Keys for desktop client integration
- **Styling**: Material-UI with custom dark theme

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Desktop Holy Grail app (for syncing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd d2r-grail-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/d2r_grail?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   API_SECRET="your-api-secret-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Initialize achievements**
   ```bash
   npx ts-node src/scripts/init-achievements.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Visit the application**
   Open [http://localhost:3001](http://localhost:3001)

## Desktop App Integration

### Setting up API Sync

1. **Generate an API Key**
   - Visit `/api-setup` on your webapp
   - Choose a unique player name
   - Copy the generated API key

2. **Configure Desktop App**
   - Open Holy Grail desktop app
   - Go to Settings > Web Sync
   - Enable "Web Sync"
   - Paste your API key
   - Enter your webapp URL
   - Click "Test Connection" to verify

3. **Automatic Sync**
   - Progress syncs automatically when new items are found
   - View your profile at `/player/your-username`

## API Endpoints

### Authentication
```http
POST /api/auth/register
{
  "playerName": "string",
  "displayName": "string?" 
}
```

### Progress Sync
```http
POST /api/progress/sync
Authorization: Bearer hg_your_api_key_here
{
  "gameMode": "Both",
  "grailType": "Both", 
  "includeRunes": true,
  "includeRunewords": true,
  "items": {},
  "ethItems": {},
  "runes": {},
  "runewords": {},
  "stats": {
    "total": 500,
    "found": 125,
    "percentage": 25.0
  }
}
```

### Public Data
```http
GET /api/player/[playerName]   # Player profile
GET /api/leaderboards         # Leaderboard data
```

## Achievement System

### Categories

- **Milestones**: First items, progress percentages
- **Completion**: Complete sets, all runes, full grail
- **Speed**: Daily item goals, streaks
- **Special**: Community achievements, rare finds

### Rarity Levels

- **Common** (Green): Basic milestones
- **Rare** (Blue): Significant progress
- **Epic** (Purple): Major accomplishments  
- **Legendary** (Orange): Ultimate achievements

## Deployment

### Production Setup

1. **Database**
   - Set up PostgreSQL in production
   - Run migrations: `npm run db:push`

2. **Environment**
   - Set production environment variables
   - Use strong secrets for JWT/API keys

3. **Build and Deploy**
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Desktop App Changes

The desktop Holy Grail app has been updated with web sync functionality:

### New Settings
- `webSyncEnabled`: Enable/disable web sync
- `webSyncApiKey`: Your unique API key
- `webSyncUrl`: Webapp URL

### Auto-Sync
- Progress syncs automatically when new items are found
- Respects sync cooldown (5 seconds between syncs)
- Includes error handling and retry logic

### UI Changes
- New "Web Sync" section in Settings
- Test connection button
- Link to open web tracker

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on the original Holy Grail desktop app
- Uses @dschu012/d2s for Diablo II save file parsing
- Inspired by the Diablo II community's dedication to completion challenges