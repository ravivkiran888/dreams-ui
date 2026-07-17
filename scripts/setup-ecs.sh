#!/bin/bash

# Production Deployment Setup Script
# This script automates the AWS setup for ECS deployment

set -e

echo "🚀 Starting Dreams React App ECS Setup"
echo "======================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: $ACCOUNT_ID"

# Variables
AWS_REGION="${1:-us-east-1}"
APP_NAME="dreams"
ECR_REPO_NAME="${APP_NAME}-react-app"
ECS_CLUSTER_NAME="${APP_NAME}-cluster"
ECS_SERVICE_NAME="${APP_NAME}-service"
TASK_FAMILY="${APP_NAME}-task-definition"

echo "🔧 Configuration:"
echo "  Region: $AWS_REGION"
echo "  App Name: $APP_NAME"
echo "  ECR Repo: $ECR_REPO_NAME"
echo "  ECS Cluster: $ECS_CLUSTER_NAME"
echo ""

# Step 1: Create ECR Repository
echo "📦 Step 1: Creating ECR Repository..."
if aws ecr describe-repositories \
    --repository-names $ECR_REPO_NAME \
    --region $AWS_REGION 2>/dev/null; then
    echo "   ✅ ECR repository already exists"
else
    aws ecr create-repository \
        --repository-name $ECR_REPO_NAME \
        --region $AWS_REGION
    echo "   ✅ ECR repository created"
fi

# Step 2: Create ECS Cluster
echo "🎯 Step 2: Creating ECS Cluster..."
if aws ecs describe-clusters \
    --clusters $ECS_CLUSTER_NAME \
    --region $AWS_REGION 2>/dev/null | grep -q "ACTIVE"; then
    echo "   ✅ ECS cluster already exists"
else
    aws ecs create-cluster \
        --cluster-name $ECS_CLUSTER_NAME \
        --region $AWS_REGION
    echo "   ✅ ECS cluster created"
fi

# Step 3: Create CloudWatch Log Group
echo "📋 Step 3: Creating CloudWatch Log Group..."
if aws logs describe-log-groups \
    --log-group-name-prefix "/ecs/$APP_NAME" \
    --region $AWS_REGION 2>/dev/null | grep -q "/ecs/$APP_NAME"; then
    echo "   ✅ Log group already exists"
else
    aws logs create-log-group \
        --log-group-name "/ecs/$APP_NAME" \
        --region $AWS_REGION
    echo "   ✅ Log group created"
fi

# Step 4: Create IAM Roles
echo "👤 Step 4: Setting up IAM Roles..."

# Task Execution Role
if aws iam get-role --role-name ecsTaskExecutionRole 2>/dev/null; then
    echo "   ✅ Task execution role already exists"
else
    aws iam create-role \
        --role-name ecsTaskExecutionRole \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }'
    
    aws iam attach-role-policy \
        --role-name ecsTaskExecutionRole \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
    
    echo "   ✅ Task execution role created"
fi

# Task Role
if aws iam get-role --role-name ecsTaskRole 2>/dev/null; then
    echo "   ✅ Task role already exists"
else
    aws iam create-role \
        --role-name ecsTaskRole \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }'
    echo "   ✅ Task role created"
fi

# Step 5: Update task definition with Account ID
echo "📝 Step 5: Updating task definition..."
sed -i "s/ACCOUNT_ID/$ACCOUNT_ID/g" ecs-task-definition.json
echo "   ✅ Task definition updated"

echo ""
echo "✅ AWS Setup Complete!"
echo ""
echo "📌 Next Steps:"
echo "  1. Add GitHub Secrets:"
echo "     - AWS_ACCESS_KEY_ID"
echo "     - AWS_SECRET_ACCESS_KEY"
echo "  2. Create IAM user for GitHub Actions:"
echo "     - aws iam create-user --user-name github-actions-dreams"
echo "     - Attach AmazonEC2ContainerRegistryPowerUser policy"
echo "     - Attach AmazonECS_FullAccess policy"
echo "  3. Create Application Load Balancer (ALB)"
echo "  4. Register ECS Service"
echo ""
echo "📖 Read DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
