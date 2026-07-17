@echo off
REM Production Deployment Setup Script for Windows
REM This script automates the AWS setup for ECS deployment

setlocal enabledelayedexpansion

echo 🚀 Starting Dreams React App ECS Setup
echo =======================================

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ AWS CLI is not installed. Please install it first.
    exit /b 1
)

REM Get AWS Account ID
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
echo ✅ AWS Account ID: %ACCOUNT_ID%

REM Variables
set AWS_REGION=us-east-1
if not "%1"=="" set AWS_REGION=%1

set APP_NAME=dreams
set ECR_REPO_NAME=%APP_NAME%-react-app
set ECS_CLUSTER_NAME=%APP_NAME%-cluster
set ECS_SERVICE_NAME=%APP_NAME%-service
set TASK_FAMILY=%APP_NAME%-task-definition

echo 🔧 Configuration:
echo   Region: %AWS_REGION%
echo   App Name: %APP_NAME%
echo   ECR Repo: %ECR_REPO_NAME%
echo   ECS Cluster: %ECS_CLUSTER_NAME%
echo.

REM Step 1: Create ECR Repository
echo 📦 Step 1: Creating ECR Repository...
aws ecr describe-repositories --repository-names %ECR_REPO_NAME% --region %AWS_REGION% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✅ ECR repository already exists
) else (
    aws ecr create-repository --repository-name %ECR_REPO_NAME% --region %AWS_REGION%
    echo    ✅ ECR repository created
)

REM Step 2: Create ECS Cluster
echo 🎯 Step 2: Creating ECS Cluster...
aws ecs describe-clusters --clusters %ECS_CLUSTER_NAME% --region %AWS_REGION% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✅ ECS cluster already exists
) else (
    aws ecs create-cluster --cluster-name %ECS_CLUSTER_NAME% --region %AWS_REGION%
    echo    ✅ ECS cluster created
)

REM Step 3: Create CloudWatch Log Group
echo 📋 Step 3: Creating CloudWatch Log Group...
aws logs describe-log-groups --log-group-name-prefix "/ecs/%APP_NAME%" --region %AWS_REGION% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✅ Log group already exists
) else (
    aws logs create-log-group --log-group-name "/ecs/%APP_NAME%" --region %AWS_REGION%
    echo    ✅ Log group created
)

REM Step 4: Update task definition with Account ID
echo 📝 Step 4: Updating task definition...
powershell -Command "(Get-Content ecs-task-definition.json) -replace 'ACCOUNT_ID', '%ACCOUNT_ID%' | Set-Content ecs-task-definition.json"
echo    ✅ Task definition updated

echo.
echo ✅ AWS Setup Complete!
echo.
echo 📌 Next Steps:
echo   1. Create IAM user for GitHub Actions:
echo      - aws iam create-user --user-name github-actions-dreams
echo   2. Create IAM access keys and add to GitHub Secrets
echo   3. Create Application Load Balancer (ALB)
echo   4. Register ECS Service
echo.
echo 📖 Read DEPLOYMENT_GUIDE.md for detailed instructions
echo.

endlocal
