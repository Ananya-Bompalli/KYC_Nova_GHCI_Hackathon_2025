# Setting Up Real AWS Rekognition Integration

## Step 1: AWS Account Setup
1. Create an AWS account at https://aws.amazon.com/
2. Access the IAM console
3. Create a new user with programmatic access

## Step 2: Configure IAM Permissions
Add this policy to your IAM user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:CompareFaces",
        "rekognition:DetectFaces",
        "rekognition:CreateFaceLivenessSession",
        "rekognition:GetFaceLivenessSessionResults",
        "rekognition:CreateCollection",
        "rekognition:IndexFaces",
        "rekognition:SearchFacesByImage",
        "rekognition:DetectLabels"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-rekognition-bucket/*"
    }
  ]
}
```

## Step 3: Configure Environment
1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit .env with your real credentials:
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA... (your actual access key)
AWS_SECRET_ACCESS_KEY=... (your actual secret key)
REKOGNITION_S3_BUCKET=your-rekognition-liveness-bucket
```

## Step 4: Create S3 Bucket (Optional)
For liveness detection, create an S3 bucket:
```bash
aws s3 mb s3://your-rekognition-liveness-bucket
```

## Step 5: Test Real Integration
1. Restart the server: `npm run server`
2. Check AWS connection: `curl http://localhost:3001/api/health`
3. The logs will show "AWS Rekognition configured" instead of "mock mode"

## Cost Considerations
- Face comparison: ~$0.001 per image
- Face detection: ~$0.001 per image  
- Liveness detection: ~$0.04 per session
- See AWS Rekognition pricing for details
