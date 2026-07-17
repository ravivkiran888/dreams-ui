# Production Deployment Guide - AWS ECS

## Overview
This guide walks through deploying the Dreams React application to AWS ECS with automated CI/CD via GitHub Actions.

## Prerequisites

### 1. AWS Account Setup
- [x] AWS Account created
- [ ] AWS CLI installed and configured
- [ ] IAM user with ECS, ECR, and related permissions

### 2. GitHub Repository Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to `master` branch

---

## Step 1: AWS Setup

### 1.1 Create IAM User for CI/CD
```bash
# Create user for GitHub Actions
aws iam create-user --user-name github-actions-dreams

# Attach policy for ECS, ECR, CloudWatch
aws iam attach-user-policy --user-name github-actions-dreams \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-user-policy --user-name github-actions-dreams \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

# Create access keys
aws iam create-access-key --user-name github-actions-dreams
```

### 1.2 Create ECR Repository
```bash
aws ecr create-repository \
  --repository-name dreams-react-app \
  --region us-east-1
```

### 1.3 Create ECS Cluster
```bash
# Create cluster
aws ecs create-cluster --cluster-name dreams-cluster --region us-east-1

# Create CloudWatch log group
aws logs create-log-group --log-group-name /ecs/dreams-app --region us-east-1
```

### 1.4 Create IAM Roles for ECS

**Task Execution Role:**
```bash
# Create role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Attach policy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

**Task Role:**
```bash
aws iam create-role \
  --role-name ecsTaskRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'
```

---

## Step 2: GitHub Secrets Configuration

Add these secrets to your GitHub repository (`Settings → Secrets and variables → Actions`):

```
AWS_ACCESS_KEY_ID: <Your IAM Access Key>
AWS_SECRET_ACCESS_KEY: <Your IAM Secret Key>
SLACK_WEBHOOK_URL: <Optional - for notifications>
```

---

## Step 3: Update Configuration Files

### Update `ecs-task-definition.json`
Replace `ACCOUNT_ID` with your AWS Account ID:
```bash
aws sts get-caller-identity --query Account --output text
```

Update:
```json
"executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
"taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskRole"
```

### Update GitHub Actions Workflow
If using a different region, update `.github/workflows/deploy-to-ecs.yml`:
```yaml
AWS_REGION: us-east-1  # Change if needed
```

---

## Step 4: Create ECS Service

### 4.1 Create Application Load Balancer (ALB)

```bash
# Create security group
aws ec2 create-security-group \
  --group-name dreams-alb-sg \
  --description "Security group for Dreams ALB"

SG_ID=<returned-sg-id>

# Allow HTTP
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Create ALB
aws elbv2 create-load-balancer \
  --name dreams-alb \
  --subnets subnet-xxxxx subnet-xxxxx \
  --security-groups $SG_ID \
  --scheme internet-facing

LB_ARN=<returned-alb-arn>
```

### 4.2 Create Target Group

```bash
aws elbv2 create-target-group \
  --name dreams-targets \
  --protocol HTTP \
  --port 5173 \
  --vpc-id vpc-xxxxx \
  --health-check-protocol HTTP \
  --health-check-path / \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

TG_ARN=<returned-target-group-arn>
```

### 4.3 Create Listener

```bash
aws elbv2 create-listener \
  --load-balancer-arn $LB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN
```

### 4.4 Register ECS Service

```bash
aws ecs create-service \
  --cluster dreams-cluster \
  --service-name dreams-service \
  --task-definition dreams-task-definition \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxxxx,subnet-xxxxx],
    securityGroups=[sg-xxxxx],
    assignPublicIp=ENABLED
  }" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=dreams-app,containerPort=5173"
```

---

## Step 5: Test Locally

### Build and run Docker image locally:
```bash
# Build
docker build -t dreams-react-app:latest .

# Run
docker run -p 5173:5173 \
  -e VITE_API_BASE_URL=http://localhost:8082 \
  dreams-react-app:latest

# Test
curl http://localhost:5173
```

### Using Docker Compose:
```bash
docker-compose up -d
docker-compose logs -f
```

---

## Step 6: Deploy

### Automatic Deployment
Simply push to `master` branch:
```bash
git add .
git commit -m "Deploy to production"
git push origin master
```

The GitHub Actions workflow will:
1. ✅ Run linting and tests
2. ✅ Build Docker image
3. ✅ Push to ECR
4. ✅ Update ECS task definition
5. ✅ Deploy to ECS (rolling update)

---

## Step 7: Monitor Deployment

### View logs in CloudWatch:
```bash
aws logs tail /ecs/dreams-app --follow
```

### Check ECS service status:
```bash
aws ecs describe-services \
  --cluster dreams-cluster \
  --services dreams-service
```

### View tasks:
```bash
aws ecs list-tasks --cluster dreams-cluster
aws ecs describe-tasks \
  --cluster dreams-cluster \
  --tasks <task-arn>
```

---

## Scaling Configuration

### Auto Scaling Setup

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/dreams-cluster/dreams-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# CPU-based scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --resource-id service/dreams-cluster/dreams-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 300
  }'
```

---

## Monitoring & Alerts

### CloudWatch Dashboard:
```bash
aws cloudwatch put-dashboard \
  --dashboard-name dreams-app-dashboard \
  --dashboard-body file://dashboard-config.json
```

### Set up alarms:
```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name dreams-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

---

## Rollback Procedure

### If deployment fails or needs rollback:

```bash
# Update service with previous task definition
aws ecs update-service \
  --cluster dreams-cluster \
  --service dreams-service \
  --task-definition dreams-task-definition:PREVIOUS_VERSION

# Or manually trigger rollback in GitHub Actions
```

---

## Estimated AWS Costs

| Service | Cost | Notes |
|---------|------|-------|
| ECS Fargate | $0.04644/hour (256 CPU, 512 MB) | ~$33/month per task |
| ECR Storage | $0.10/GB/month | First 500MB free |
| Data Transfer | $0.09/GB out | Minimal for app |
| CloudWatch Logs | $0.50/GB ingested | ~$5-10/month |
| ALB | $16.20/month | Fixed cost |
| **Total (2 tasks)** | **~$110-120/month** | Highly available setup |

---

## Troubleshooting

### Tasks won't start:
```bash
# Check logs
aws logs tail /ecs/dreams-app --follow

# Describe task
aws ecs describe-tasks --cluster dreams-cluster --tasks <task-arn>
```

### Can't push to ECR:
```bash
# Re-login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### Service stuck in provisioning:
```bash
# Update service again
aws ecs update-service --cluster dreams-cluster --service dreams-service --force-new-deployment
```

---

## Next Steps

1. Set up Route53 for custom domain
2. Add SSL/TLS certificate via ACM
3. Configure CloudFront CDN for frontend caching
4. Set up RDS for database
5. Implement CI/CD notifications via Slack
6. Set up backup strategy

---

**Deployment Status:** 🚀 Ready for production!
