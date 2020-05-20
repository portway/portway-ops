# Stripe Billing Status Refresh Job

This module + Docker image will update all active organization's stripe status to ensure account information is in sync between the Portway database's org status and Stripe's info for that customer

## Environment Variables
**ADMIN_API_KEY** The portway admin key
**API_URL**  The url to the portway api

## Creating the Docker image and pushing to Docker Hub
1. `docker build -t bonkeybong/portway_org_stripe_refresh .`
1. `docker push bonkeybong/portway_org_stripe_refresh`

## Locally running the Docker image
1. Create a `.env` file with the above values
1. Run `docker run --env-file='.env' bonkeybong/portway_org_stripe_refresh`