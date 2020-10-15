# Deleted Org Cleanup

This module + Docker image will fetch canceled organizations and trigger data deletion when beyond the set retention period

## Environment Variables
**ADMIN_API_KEY** The portway admin key
**API_URL**  The url to the portway api

## Creating the Docker image and pushing to Docker Hub
1. `docker build -t bonkeybong/portway_deleted_org_cleanup .`
1. `docker push bonkeybong/portway_deleted_org_cleanup`

## Locally running the Docker image
1. Create a `.env` file with the above values
1. Run `docker run --env-file='.env' bonkeybong/portway_deleted_org_cleanup`