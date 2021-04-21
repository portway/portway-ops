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

## Production builds
Once the branch is merged to master in this repo, a Codefresh pipeline will build, tag, and push a Docker image to bonkeybong/portway_db_jobs on Docker Hub. Then the job yaml in the Portway repo can be manually updated and applied on a Kubernetes cluster to run jobs from that tag.

Steps:
1. After merging a new db script to master, Codefresh should build a Docker image from master and push it to Docker hub
2. Navigate to Docker hub to see the latest Docker image tag with that script: [Docker hub db jobs](https://hub.docker.com/repository/docker/bonkeybong/portway_db_jobs)
3. Locally, ensure your `kubectl` is connected to the desired cluster to run the job on
4. In the Portway code repo, navigate to `kubernetes/jobs` and edit the `databaseJobs.yaml` file
5. Update the `image` line to point to the new tag from step 2
6. Update the `args` with the db script you would like to run (this is the name you chose when adding a new script in step 2 of "Add a new db script"
7. Be sure to save the file
8. Run `kubectl delete -n default job portway-db-job` to delete the previous job
9. Run `kubectl apply -f databaseJobs.yaml` (assuming you are in the Portway `kubernetes/jobs` directory)
