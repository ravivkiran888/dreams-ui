# Dreams React App 📈

> A production-grade React application for real-time market data analysis with automated CI/CD deployment to AWS ECS.

## 🚀 Deployment Status

[![CI/CD Pipeline](https://github.com/saigo/dreams/actions/workflows/deploy-to-ecs.yml/badge.svg?branch=master)](https://github.com/saigo/dreams/actions/workflows/deploy-to-ecs.yml)
[![Build Status](https://img.shields.io/github/actions/workflow/status/saigo/dreams/deploy-to-ecs.yml?branch=master&label=Build)](https://github.com/saigo/dreams/actions)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js)](https://nodejs.org)

### 📊 Live Deployment
- **Production URL:** [dreams.aws.example.com](https://dreams.aws.example.com)
- **Monitor via:** [GitHub Actions](https://github.com/saigo/dreams/actions/workflows/deploy-to-ecs.yml)

---

## 📋 Features

- ✅ Real-time market indices tracking
- ✅ High-volume scripts monitoring
- ✅ Bullish signals detection
- ✅ Responsive Bootstrap UI
- ✅ Production-grade CI/CD with GitHub Actions
- ✅ Containerized with Docker
- ✅ Auto-deployed to AWS ECS
- ✅ CloudWatch monitoring & logs
- ✅ Auto-scaling capable

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + Vite |
| **UI Framework** | React Bootstrap |
| **Container** | Docker |
| **Orchestration** | AWS ECS Fargate |
| **Registry** | AWS ECR |
| **Monitoring** | CloudWatch |
| **CI/CD** | GitHub Actions |
| **Package Manager** | npm |

---

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
http://localhost:5173
```

### Local Testing with Docker
```bash
# Build and run
docker-compose up -d

# Visit
http://localhost:5173

# Stop
docker-compose down
```

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm test          # Run tests (if configured)
```

---

## 🔄 CI/CD Pipeline

### Automatic Deployment Flow
```
git push to master
    ↓
GitHub Actions Triggered
    ├─ ✅ Lint & Test
    ├─ ✅ Build Docker Image
    ├─ ✅ Push to AWS ECR
    └─ ✅ Deploy to AWS ECS
        ↓
    🎉 Live on AWS!
```

### View Workflow Status
- [GitHub Actions Workflows](https://github.com/saigo/dreams/actions)
- [Deployment History](https://github.com/saigo/dreams/actions/workflows/deploy-to-ecs.yml)

---

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - AWS setup instructions
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Local development guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview

---

## 📊 Monitoring & Alerts

### CloudWatch Dashboard
- CPU & Memory metrics
- Task health status
- Error rates
- Request latency

### GitHub Actions Notifications
- ✅ Automatic on deployment success
- ❌ Alerts on build failures
- 📧 Optional Slack notifications

---

## 🌍 Pages

The application features multiple pages:

| Route | Purpose |
|-------|---------|
| `/` | Dashboard with market indices |
| `/high-volume-scripts` | High volume trading scripts |
| `/bullish` | Bullish technical signals |

---

## 📝 Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8082
```

For production, configure via GitHub Secrets or AWS Systems Manager.

---

## 🐳 Docker

### Build Image
```bash
docker build -t dreams-react-app:latest .
```

### Run Container
```bash
docker run -p 5173:5173 \
  -e VITE_API_BASE_URL=http://localhost:8082 \
  dreams-react-app:latest
```

---

## ☁️ AWS Deployment

### Infrastructure
- **ECR:** Docker image repository
- **ECS:** Container orchestration (Fargate)
- **ALB:** Load balancer
- **CloudFront:** CDN (optional)
- **CloudWatch:** Logging & monitoring

### Estimated Costs
- ~$100-120/month for production setup (2 tasks)
- ~$0.04644/hour per Fargate task
- Scales automatically based on load

---

## 🔐 Security

✅ IAM roles with least privilege  
✅ Secrets managed securely  
✅ Container health checks  
✅ CloudWatch monitoring  
✅ HTTPS/SSL support (via CloudFront)

---

## 🚨 Troubleshooting

### Build Fails
```bash
npm ci
npm run build
npm run preview
```

### Docker Issues
```bash
docker-compose down -v
docker-compose up -d
```

### Deployment Issues
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting section

---

## 📈 Deployment Monitoring

Check [GitHub Actions Workflow](https://github.com/saigo/dreams/actions/workflows/deploy-to-ecs.yml) for:
- Latest deployment status
- Build logs
- Detailed deployment history
- Failed deployment details

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Commit and push
4. Create Pull Request
5. Automated tests run automatically
6. After approval, merge to master
7. Automatic deployment to production! 🚀

---

## 📞 Support

For issues and questions:
- Check [Troubleshooting](./DEPLOYMENT_GUIDE.md#troubleshooting)
- Review [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Check GitHub Issues

---

## 📄 License

MIT

---

**Last Updated:** 2026-07-17  
**Status:** 🟢 Production Ready
