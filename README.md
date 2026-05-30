# DevOps Capstone Project repository containing CI/CD pipeline setup, infrastructure automation.

                    DEVOPS CAPSTONE PROJECT - README

================================================================================

## PROJECT TITLE

End-to-End DevOps Pipeline for a Node.js Web Application

## PROJECT DESCRIPTION

This capstone project ties together Git, Jenkins, Docker, AWS, shell scripting,
monitoring, and automation into one real-world continuous delivery pipeline.

## TECH STACK

Layer Tools / Technologies

---

Source Control Git + GitHub
CI/CD Jenkins on EC2
Application Node.js web app (single container)
Containerization Docker + Docker Hub
Infrastructure AWS EC2 (Ubuntu)
Monitoring Prometheus, Grafana, Node Exporter
Scripting & Jobs Bash + Cron

## ARCHITECTURE OVERVIEW

1. Developer pushes code to GitHub.

2. Jenkins (on EC2):
   a. Triggers on commit
   b. Installs dependencies
   c. Builds and pushes Docker image to Docker Hub
   d. SSH into App EC2 and deploys container

3. Prometheus + Grafana monitor the container and EC2 instance.

4. Crontab job backs up logs or app data using a bash script.

## CI/CD FLOW (BRIEF)

GitHub (push) -> Jenkins (build, test, docker build/push) ->
Docker Hub (image) -> EC2 (pull & run container) ->
Prometheus/Grafana (monitor) + Cron (backup/cleanup)

## SETUP INSTRUCTIONS (LOCAL)

Prerequisites: - Node.js and npm installed - Docker installed - Git installed

1. Clone the repository:
   git clone <your-github-repo-url>
   cd DevOpsCapstone

2. Install application dependencies:
   npm install

3. Run the application locally (without Docker):
   npm start
   (Adjust the start script if your package.json uses a different command.)

4. Build and run with Docker locally:
   docker build -t <image-name> .
   docker run -p <host-port>:<container-port> <image-name>

5. For full pipeline testing, configure Jenkins, AWS EC2, Docker Hub
   credentials, and monitoring as described in your project report.

## REPOSITORY CONTENTS (REQUIRED)

Your GitHub repository should include: - Application source code - Jenkinsfile - Dockerfile - README.md with setup and run instructions

## PIPELINE STAGES (FOR REPORT)

Build - Install dependencies, compile/package application
Test - Run automated tests (if configured)
Deploy - Build Docker image, push to Docker Hub, deploy on EC2
Monitor - Prometheus metrics, Grafana dashboards, alerts

## NOTES

- Replace placeholder values (<image-name>, ports, repo URL) with your
  actual project settings.
- Keep Jenkins credentials, AWS keys, and Docker Hub tokens out of
  version control; use Jenkins credentials store or environment variables.

================================================================================
End of README
================================================================================
