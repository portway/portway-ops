# Deletes Soft-Deleted Resources

Resources in Portway use sequelize's paranoid feature to "soft delete" them. After 30 days,
we want to permanently delete the resources, which this job does.

## Environment Variables
**ADMIN_API_KEY** The Portway admin key
**API_URL**  The url to the Portway API

## Creating the Docker image and pushing to Docker Hub
1. `docker build -t bonkeybong/portway_delete_resources .`
1. `docker push bonkeybong/portway_delete_resources`

## Locally running the Docker image
1. Create a `.env` file with the above values
1. Run `docker run --env-file='.env' bonkeybong/portway_delete_resources`