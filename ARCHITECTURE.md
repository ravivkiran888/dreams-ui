# AWS ECS CI/CD Architecture

## Pipeline Flow

```
┌─────────────────┐
│  Git Push to    │
│    master       │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  GitHub Actions      │
│  Workflow Triggered  │
└────────┬─────────────┘
         │
         ├─► Job 1: Lint & Test
         │   ├─ ESLint
         │   ├─ Unit Tests
         │   └─ Security Scan
         │
         ├─► Job 2: Build & Push (if Job 1 passes)
         │   ├─ Build Docker Image
         │   ├─ Push to ECR
         │   └─ Tag latest
         │
         └─► Job 3: Deploy to ECS (if Job 2 passes)
             ├─ Update Task Definition
             ├─ Deploy to ECS Cluster
             ├─ Wait for stability
             └─ Verify deployment

         ▼
┌──────────────────────┐
│  Production Live     │
│  (Auto-scaled)       │
└──────────────────────┘
```

## AWS Services Used

### 1. **ECR (Elastic Container Registry)**
- Store Docker images
- Image URI format: `<account-id>.dkr.ecr.us-east-1.amazonaws.com/dreams-react-app:latest`

### 2. **ECS (Elastic Container Service)**
- Run containerized application
- Fargate launch type (serverless)
- Tasks: 256 CPU, 512 MB memory

### 3. **CloudWatch**
- Log aggregation
- Performance monitoring
- Health checks

### 4. **ALB (Application Load Balancer)**
- Distribute traffic
- Health checks
- Target groups

### 5. **Auto Scaling**
- Scale based on CPU/Memory
- Min: 2 tasks, Max: 10 tasks

## File Structure

```
dreams/
├── .github/
│   └── workflows/
│       └── deploy-to-ecs.yml         # CI/CD Pipeline
├── Dockerfile                         # Container image
├── docker-compose.yml                 # Local development
├── ecs-task-definition.json          # ECS configuration
├── DEPLOYMENT_GUIDE.md               # Setup instructions
├── DEVELOPMENT_GUIDE.md              # Local dev guide
├── src/                              # React app
├── package.json
└── vite.config.js
```

## Workflow Jobs

### Job 1: Lint & Test
- Runs on every push
- Runs on PR creation
- Outputs: Pass/Fail

### Job 2: Build & Push
- Only runs if Job 1 passes
- Only runs on `master` branch push
- Builds Docker image
- Pushes to ECR with tags:
  - `<commit-sha>`
  - `latest`

### Job 3: Deploy to ECS
- Only runs if Job 2 passes
- Updates task definition
- Deploys to ECS service
- Waits for stability
- Handles rolling updates

## Security Features

✅ IAM roles with least privilege
✅ Health checks on containers
✅ Secrets managed via AWS Secrets Manager
✅ Private ECR repository
✅ Network isolation with security groups
✅ CloudWatch logging

## Monitoring & Alerts

### CloudWatch Metrics
- CPU Utilization
- Memory Utilization
- Task count
- Deployment count

### Logs
- All container logs go to `/ecs/dreams-app`
- Accessible via CloudWatch Logs
- Retention: Configurable

## Scaling Strategy

### CPU-based Scaling
- Target CPU: 70%
- Min tasks: 2
- Max tasks: 10
- Scale out: 60s cooldown
- Scale in: 300s cooldown

## Deployment Strategy

### Rolling Update
- Start new tasks with new image
- Remove old tasks when healthy
- Zero downtime
- Automatic rollback on failure

## Cost Optimization

| Item | Optimization |
|------|--------------|
| CPU/Memory | Adjust in task definition |
| Desired Count | Start with 2, scale as needed |
| Data Transfer | Use CloudFront CDN |
| Logs | Set retention policy |
| Idle resources | Use ECS scheduled scaling |

## Disaster Recovery

### Rollback
- Keep previous task definitions
- Can quickly roll back to previous version
- ALB automatically switches traffic

### Backup
- ECR images are immutable
- Tag important releases
- Version control in Git

---

**Ready to deploy!** 🚀
