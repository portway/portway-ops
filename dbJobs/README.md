# Portway Database Jobs

This codebase contains the core connection code to connect to the Portway database from within a Portway k8s cluster.

k8s yaml configuration can be found in the main Portway repo in `kuberenetes/jobs/databaseJobs.yaml`

## Add a new db script

1. Create a new file in `scripts/` that exports a single function that takes a `db` argument. `db` is an instance of a pg db connection with a query function. `db.query('SELECT * FROM ...')`. The function should return a result that will be output to the console.  
2. Edit index.js and add the script name and filename to the `scripts` constant. See index.js for details.

## Locally build and run the Docker image

1. Create a `.env` file with the required values
1. `docker build -t bonkeybong/portway_db_jobs .`
1. Run `docker run --env-file='.env' bonkeybong/portway_db_jobs [scriptName]`