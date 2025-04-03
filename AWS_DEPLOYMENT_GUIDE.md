# AWS Deployment Guide for Welfare Committee Form

## Prerequisites

1. AWS Account with necessary permissions
2. AWS CLI installed and configured
3. Node.js application ready for deployment

## Step 1: Set Up EC2 Instance

1. Launch an EC2 instance:
   - Choose Amazon Linux 2 AMI
   - Select t2.micro (free tier) or larger based on needs
   - Configure Security Group:
     - Allow HTTP (80)
     - Allow HTTPS (443)
     - Allow SSH (22)

2. Create and download key pair for SSH access

## Step 2: Configure Database Storage

### Option A: Using EBS Volume (for SQLite)

1. Create an EBS volume:
   ```bash
   aws ec2 create-volume --size 20 --region your-region --availability-zone your-az
   ```

2. Attach volume to EC2 instance:
   ```bash
   aws ec2 attach-volume --volume-id vol-xxx --instance-id i-xxx --device /dev/sdf
   ```

3. Mount the volume:
   ```bash
   sudo mkdir /data
   sudo mount /dev/xvdf /data
   ```

### Option B: Using Amazon RDS (for production scale)

1. Create RDS instance with PostgreSQL
2. Update application code to use PostgreSQL instead of SQLite

## Step 3: Install Dependencies

```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16

# Install PM2 for process management
npm install -g pm2
```

## Step 4: Deploy Application

1. Clone repository:
   ```bash
   git clone your-repository-url
   cd welfare-committee-form
   ```

2. Install dependencies:
   ```bash
   npm install
   npm run build
   ```

3. Set up environment variables in `.env.production`:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=/data/welfare_committee.db
   FRONTEND_URL=https://your-domain.com
   VITE_API_URL=https://your-domain.com
   UPLOADS_DIR=/data/uploads
   EXPORTS_DIR=/data/exports
   ```

4. Start application with PM2:
   ```bash
   pm2 start server.js --name welfare-committee
   pm2 save
   pm2 startup
   ```

## Step 5: Set Up Domain and SSL

1. Register domain in Route 53 or use existing domain

2. Create SSL certificate in AWS Certificate Manager

3. Set up Application Load Balancer:
   - Create target group with EC2 instance
   - Configure HTTPS listener with SSL certificate
   - Update DNS records to point to ALB

## Step 6: Set Up CI/CD Pipeline

1. Create CodePipeline:
   - Source: GitHub repository
   - Build: CodeBuild project
   - Deploy: CodeDeploy application

2. Create buildspec.yml:
   ```yaml
   version: 0.2
   phases:
     install:
       runtime-versions:
         nodejs: 16
     pre_build:
       commands:
         - npm install
     build:
       commands:
         - npm run build
     post_build:
       commands:
         - aws s3 cp dist s3://your-bucket --recursive
   artifacts:
     files:
       - '**/*'
   ```

## Step 7: Monitoring and Logging

1. Set up CloudWatch:
   - Create log group
   - Configure metrics
   - Set up alarms

2. Enable EC2 detailed monitoring

## Step 8: Backup Strategy

1. Create EBS snapshots schedule
2. Set up S3 bucket for file backups
3. Configure backup automation using AWS Backup

## Security Best Practices

1. Use IAM roles instead of access keys
2. Regularly update security groups
3. Enable AWS WAF for protection against common web exploits
4. Implement AWS Shield for DDoS protection

## Scaling Considerations

1. Use Auto Scaling groups
2. Implement caching with ElastiCache
3. Consider using S3 for static file storage
4. Use CloudFront for content delivery

## Troubleshooting

1. Check application logs:
   ```bash
   pm2 logs welfare-committee
   ```

2. Monitor system resources:
   ```bash
   top
   df -h
   ```

3. View nginx logs (if using):
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

## Cost Optimization

1. Use Reserved Instances for predictable workloads
2. Implement auto-scaling based on demand
3. Monitor AWS Cost Explorer regularly
4. Use AWS Budgets to set spending limits

## Maintenance

1. Regular system updates:
   ```bash
   sudo yum update -y
   ```

2. Database maintenance:
   - Regular backups
   - Performance optimization
   - Index maintenance

3. SSL certificate renewal (automated with ACM)

4. Monitor and rotate logs

Remember to always follow AWS best practices and security guidelines when deploying your application.