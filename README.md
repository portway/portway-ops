# portway-ops
Portway support scripts, Docker images, etc.

This repo contains the code to build the docker images, see the individual READMEs in each subfolder.

The k8s yaml for the jobs is found in the main repo in `kubernetes/jobs`. The job yaml must be manually applied, automatic deployments do not apply the jobs to the k8s clusters.

## Portway DB Jobs
The `/dbJobs` folder contains a repo of one-off database scripts that can be run as a k8s job.
