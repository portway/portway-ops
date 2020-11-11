# Remove Unverified Organizations

Portway allows users to sign up for a free trial, but they must verify their email address.
If a user does not verify their email address within 14 days, we remove the organization.

## Environment Variables
**ADMIN_API_KEY** The Portway admin key
**API_URL**  The url to the Portway API

## Creating the Docker image and pushing to Docker Hub
1. `docker build -t bonkeybong/portway_remove_unverified_org .`
1. `docker push bonkeybong/portway_remove_unverified_org`

## Locally running the Docker image
1. Create a `.env` file with the above values
1. Run `docker run --env-file='.env' bonkeybong/portway_remove_unverified_org`