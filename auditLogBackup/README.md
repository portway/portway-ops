# Audit log S3 backup

This module + Docker image will download the previous day's log file from Rapid7 InsightOps and then store it on S3

## Environment Variables
**S3_CONTENT_BUCKET** the S3 bucket to upload the audit log files to
**AWS_SES_REGION** The AWS region of the S3 content bucket (eg 'us-west-2')
**API_KEY** The rapid7 InsightOps API key needed to access the REST API
**LOG_ID** The ID of the insightOps log to backup
**AWS_ACCESS_KEY_ID** An AWS key with access to write to the S3 bucket
**AWS_SECRET_ACCESS_KEY** The secret associated with the AWS key

## Creating the Docker image and pushing to Docker Hub
1. `docker build -t bonkeybong/portway_audit_log_backup .`
1. `docker push bonkeybong/portway_audit_log_backup`

## Locally running the Docker image
1. Create a `.env` file with the above values
1. Run `docker run --env-file='.env' bonkeybong/portway_audit_log_backup`