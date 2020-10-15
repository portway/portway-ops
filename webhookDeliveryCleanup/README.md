# Webhook Delivery Cleanup

This module + Docker image will delete webhook delivery records beyond the retention period

## Environment Variables
**ADMIN_API_KEY** The Portway admin key
**API_URL**  The url to the Portway API

## Creating the Docker image and pushing to Docker Hub
1. `docker build -t bonkeybong/portway_webhook_delivery_cleanup .`
1. `docker push bonkeybong/portway_webhook_delivery_cleanup`

## Locally running the Docker image
1. Create a `.env` file with the above values
1. Run `docker run --env-file='.env' bonkeybong/portway_webhook_delivery_cleanup`