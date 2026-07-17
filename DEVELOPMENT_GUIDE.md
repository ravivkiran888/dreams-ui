# Local Development Guide

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- AWS CLI (for deployment)

## Quick Start

### Option 1: Without Docker (Development)
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:5173
```

### Option 2: With Docker (Production-like)
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Open browser
http://localhost:5173

# Stop
docker-compose down
```

## Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8082
```

## Building for Production

### Local build:
```bash
npm run build
npm run preview
```

### Docker build:
```bash
docker build -t dreams-react-app:latest .
docker run -p 5173:5173 dreams-react-app:latest
```

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Database Configuration

Configure your API endpoint in `src/config/api.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
```
