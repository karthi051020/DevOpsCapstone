# DevOps Capstone Project — Simple Node.js App

A complete end-to-end DevOps pipeline for a Node.js Wikipedia search application, built using Jenkins, Docker, Prometheus, and Grafana on AWS EC2.

---

## Project Architecture

```
Developer (GitHub push)
        ↓ webhook
Jenkins EC2 (builds & pushes Docker image)
        ↓ SSH deploy
App EC2 (runs Node.js container)
        ↓ metrics (port 9100 + 3000)
Prometheus EC2 (scrapes metrics)
        ↓
Grafana (visualizes dashboards)
        ↓
Crontab (backs up logs hourly)
```

---

## Infrastructure

| EC2 Instance       | Software Installed                 | Role                                          |
| ------------------ | ---------------------------------- | --------------------------------------------- |
| **Jenkins EC2**    | Jenkins, Docker                    | CI/CD Server — builds and pushes Docker image |
| **App EC2**        | Docker, Node Exporter              | Runs the Node.js container                    |
| **Monitoring EC2** | Prometheus, Grafana, Node Exporter | Monitors all EC2 instances and container      |

---

## Application

**Simple Node.js Wikipedia Search App**

- Built with **Node.js** and **Express**
- Uses **Wikipedia REST API** to search for any person by name
- Returns JSON data including title, description, summary, thumbnail and Wikipedia URL
- Frontend rendered with **EJS** templating engine
- Exposes `/metrics` endpoint for **Prometheus** monitoring via `prom-client`

### Usage

1. Open `http://<app-ec2-public-ip>:3000`
2. Enter a person's name (e.g. `Elon Musk`) in the search box
3. Click **Search**
4. Get Wikipedia JSON data back in the browser

---

## CI/CD Pipeline (Jenkins)

The pipeline is fully automated and triggers on every GitHub push.

### Pipeline Stages

| Stage                  | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| **Checkout**           | Clones the latest code from GitHub                             |
| **Build Docker Image** | Builds Docker image and tags it with build number and `latest` |
| **Push to Docker Hub** | Pushes both `build-N` and `latest` tags to Docker Hub          |
| **Deploy to App EC2**  | SSHs into App EC2 and runs the new container                   |

### Jenkins Configuration

- **Trigger:** GitHub webhook on every push
- **Credentials:**
  - `dockerhub-credentials` — Docker Hub PAT (Username + Token)
  - `app-ec2-ssh-key` — SSH private key to access App EC2
- **Plugins Required:** Git, Docker Pipeline, SSH Agent

---

## Docker Hub

Images are pushed to Docker Hub with two tags on every build:

- `karthi051020/devops-capstone-proj:latest`
- `karthi051020/devops-capstone-proj:build-N`

---

## Monitoring (Prometheus + Grafana)

### Prometheus Scrape Jobs

| Job                            | Target                      | Monitors                      |
| ------------------------------ | --------------------------- | ----------------------------- |
| `prometheus`                   | `localhost:9090`            | Prometheus itself             |
| `node-exporter-prometheus-ec2` | `localhost:9100`            | Monitoring EC2 system metrics |
| `node-exporter-app-ec2`        | `<app-ec2-private-ip>:9100` | App EC2 system metrics        |
| `nodejs-app`                   | `<app-ec2-private-ip>:3000` | Node.js app metrics           |

### Grafana Dashboard

- **Data Source:** Prometheus
- **Dashboard:** Node Exporter Full (ID: `1860`)
- Monitors CPU, Memory, Disk, Network for App EC2
- Live graphs update in real time

### Access

| Service            | URL                                              |
| ------------------ | ------------------------------------------------ |
| Prometheus         | `http://<monitoring-ec2-public-ip>:9090`         |
| Grafana            | `http://<monitoring-ec2-public-ip>:3000`         |
| Prometheus Targets | `http://<monitoring-ec2-public-ip>:9090/targets` |

---

## Backup (Cron Job)

A bash script runs every hour on the App EC2 to back up container logs and app data.

### Schedule

```
0 * * * * /home/ubuntu/backup.sh
```

### What it backs up

- Docker container logs → `/home/ubuntu/backups/`
- App data directory (if exists)
- Auto cleans backups older than 7 days

### Check backups

```bash
ls -la /home/ubuntu/backups/
cat /home/ubuntu/backups/backup.log
```

---

## Repository Structure

```
simple-nodejs-app/
├── views/
│   └── index.ejs          # Frontend EJS template
├── index.js               # Main Express app
├── package.json           # Node.js dependencies
├── Dockerfile             # Docker build instructions
├── Jenkinsfile            # CI/CD pipeline definition
└── README.md              # Project documentation
```

---

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/rat9615/simple-nodejs-app.git
cd simple-nodejs-app

# Install dependencies
npm install

# Start the app
npm start

# Open in browser
http://localhost:3000
```

---

## Key Ports

| Port   | Service       | EC2                      |
| ------ | ------------- | ------------------------ |
| `8080` | Jenkins       | Jenkins EC2              |
| `3000` | Node.js App   | App EC2                  |
| `9100` | Node Exporter | App EC2 + Monitoring EC2 |
| `9090` | Prometheus    | Monitoring EC2           |
| `3000` | Grafana       | Monitoring EC2           |

---

## Author

**Karthick** — DevOps Capstone Project
