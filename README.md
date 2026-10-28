# CI/CD Pipeline for an IT Service Desk Portal

[![CI/CD Pipeline](https://img.shields.io/badge/Jenkins-Pipeline-blue?logo=jenkins)](./Jenkinsfile)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)](./docker-compose.yml)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-6DB33F?logo=springboot)](./backend)
[![React](https://img.shields.io/badge/Frontend-React%2019%20+%20Vite-61DAFB?logo=react)](./frontend)
[![Ansible](https://img.shields.io/badge/Ansible-Config%20Management-EE0000?logo=ansible)](./ansible)
[![License](https://img.shields.io/badge/License-Academic-lightgrey.svg)](#)

A full-stack, enterprise-grade IT Service Desk application accompanied by an automated, end-to-end DevOps CI/CD pipeline. The project incorporates continuous integration, automated testing (unit and end-to-end UI tests), containerized deployment using Docker Compose, and infrastructure configuration management using Ansible.

---

## Developer Information
- **Developer:** Sahil Gawade
- **Roll No.:** 24102B2003
- **Repository:** [ServiceDesk-CICD](https://github.com/Sahil-2005/ServiceDesk-CICD)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Directory Structure](#directory-structure)
6. [Prerequisites](#prerequisites)
7. [How to Run Each and Everything](#how-to-run-each-and-everything)
   - [Method 1: Run with Docker Compose (Recommended)](#method-1-run-with-docker-compose-recommended)
   - [Method 2: Run Locally in Development Mode](#method-2-run-locally-in-development-mode)
   - [Method 3: Run Automated Tests (Unit & E2E)](#method-3-run-automated-tests-unit--e2e)
   - [Method 4: Run Configuration Management with Ansible](#method-4-run-configuration-management-with-ansible)
   - [Method 5: Run CI/CD Pipeline with Jenkins](#method-5-run-cicd-pipeline-with-jenkins)
8. [API Endpoints Reference](#api-endpoints-reference)
9. [Roles & Permissions](#roles--permissions)
10. [DevOps Milestone Mapping](#devops-milestone-mapping)

---

## Project Overview

The **IT Service Desk Portal** streamlines internal IT issue reporting and ticket lifecycle management within an organization. It allows regular employees to raise tickets, technical support agents to review and update progress, and administrators to oversee all tickets, categories, and system health metrics.

The DevOps pipeline automates every step from source code management, unit testing, and packaging, to UI browser testing, container image building, and automated deployment.

---

## Key Features

- **Authentication & Security:** JWT (JSON Web Token) authentication with stateless session management and password hashing via BCrypt.
- **Role-Based Access Control (RBAC):** Distinct permissions for `ROLE_USER`, `ROLE_AGENT`, and `ROLE_ADMIN`.
- **Ticket Lifecycle Management:** Full CRUD operations supporting status transitions (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) and priority ratings (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
- **Real-Time Dashboard:** Overview of ticket metrics, counts by status, and recent activity.
- **Search & Filtering:** Dynamic query filtering by keyword, status, and category.
- **Modern User Interface:** High-contrast Neobrutalist design with vibrant violet accents and responsive layouts.
- **Single Page Application Routing:** Nginx reverse proxy with fallback routing to support client-side refreshes without 404 errors.
- **Automated Health Monitoring:** Spring Boot Actuator health endpoint (`/actuator/health`) used as a deployment readiness probe.

---

## Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.2.4 (Web, Security, Data JPA, Actuator), Maven |
| **Frontend** | React 19, Vite, React Router v7, Axios, Tailwind CSS v4 |
| **Database** | MySQL 8.4 (Production & Docker), H2 In-Memory (Automated Tests) |
| **Reverse Proxy** | Nginx (Alpine-based production container) |
| **Containerization** | Docker, Docker Compose (Multi-stage container builds) |
| **CI/CD Automation**| Jenkins Declarative Pipeline (`Jenkinsfile`) |
| **Automated Testing**| JUnit 5, Pytest, Selenium WebDriver (Microsoft Edge headless) |
| **Configuration Mgmt**| Ansible (Automated environment setup & dependency provisioning) |
| **VCS & Collaboration**| Git, GitHub (Feature branch workflow, Pull Requests) |

---

## System Architecture

```
                      +---------------------------------------+
                      |           Client Web Browser          |
                      +-------------------+-------------------+
                                          |
                                          | HTTP (Port 80)
                                          v
                      +---------------------------------------+
                      |         Docker: Frontend (Nginx)      |
                      |   - Static SPA Assets (React + Vite)  |
                      |   - try_files $uri /index.html        |
                      +-------------------+-------------------+
                                          |
                                          | REST API Calls (Port 8080)
                                          v
                      +---------------------------------------+
                      |         Docker: Backend (Spring Boot) |
                      |   - Spring Security & JWT Filter      |
                      |   - Ticket & Auth Controllers         |
                      |   - Spring Boot Actuator (/health)    |
                      +-------------------+-------------------+
                                          |
                                          | JDBC (Port 3306)
                                          v
                      +---------------------------------------+
                      |        MySQL Database (servicedesk_db)|
                      |   - Users, Roles, Tickets Schema      |
                      +---------------------------------------+
```

---

## Directory Structure

```
ServiceDesk-CICD/
├── Jenkinsfile                 # Jenkins declarative CI/CD pipeline definition
├── docker-compose.yml          # Multi-container orchestration (Backend + Frontend)
├── README.md                   # Complete project documentation and run guides
├── ansible/                    # Configuration management
│   ├── hosts.ini               # Target inventory definition
│   └── servicedesk-setup.yml   # Playbook for system & prerequisite provisioning
├── backend/                    # Spring Boot REST API
│   ├── Dockerfile              # Container definition (Eclipse Temurin 17 Alpine)
│   ├── pom.xml                 # Maven build dependencies and profiles
│   ├── mvnw / mvnw.cmd         # Maven wrapper scripts
│   └── src/
│       ├── main/               # Application source code (Java & resources)
│       └── test/               # JUnit unit & integration tests
├── frontend/                   # React user interface
│   ├── Dockerfile              # Multi-stage container build (Node -> Nginx)
│   ├── nginx.conf              # Nginx server configuration with SPA routing
│   ├── package.json            # Node dependencies and build scripts
│   ├── vite.config.js          # Vite bundler configuration
│   └── src/                    # Components, pages, and API service layers
├── tests/                      # Automated test suites
│   └── ui/                     # End-to-End UI browser testing
│       ├── requirements.txt    # Python Selenium & Pytest dependencies
│       └── test_ui.py          # Selenium test cases (Headless Edge)
└── docs/                       # Academic documentation and sprint reports (Weeks 1-12)
```

---

## Prerequisites

Before running the application, ensure the following software is installed on your host system:

- **Git:** `git --version` (>= 2.40)
- **Java Development Kit:** OpenJDK 17 (`java -version`)
- **Node.js & npm:** Node >= 20.x, npm >= 10.x (`node -v`, `npm -v`)
- **Docker Desktop:** Docker engine with Docker Compose enabled (`docker --version`, `docker compose version`)
- **Python:** Python 3.10+ (for Selenium E2E UI testing)
- **Microsoft Edge & EdgeDriver:** Required only for running the Selenium E2E tests

---

## How to Run Each and Everything

### Method 1: Run with Docker Compose (Recommended)

This is the fastest and most reliable way to spin up the entire application stack.

#### Step 1: Start the MySQL Database Container
Ensure your MySQL database container is running and listening on port 3306:

```bash
docker run -d \
  --name servicedesk-mysql \
  -p 3306:3306 \
  -e MYSQL_DATABASE=servicedesk_db \
  -e MYSQL_USER=servicedesk_user \
  -e MYSQL_PASSWORD=ServiceDesk_Dev_2026 \
  -e MYSQL_ROOT_PASSWORD=root_password \
  mysql:8.4
```

> **Note:** If `servicedesk-mysql` is already created, simply start it:
> ```bash
> docker start servicedesk-mysql
> ```

#### Step 2: Build the Backend WAR File
The backend container packages the compiled artifact into a lightweight Java runtime image:

```bash
cd backend
./mvnw clean package -DskipTests
# On Windows PowerShell / Command Prompt:
# .\mvnw.cmd clean package -DskipTests
cd ..
```

#### Step 3: Launch Frontend and Backend Containers
From the root of the repository:

```bash
docker-compose up --build -d
```

#### Step 4: Verify the Services
- **Frontend Web UI:** Open [http://localhost](http://localhost) in your web browser.
- **Backend API:** [http://localhost:8080/api/tickets](http://localhost:8080/api/tickets)
- **Actuator Health Check:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health) (returns `{"status":"UP"}`)

#### Useful Docker Management Commands:
- **View container logs:**
  ```bash
  docker-compose logs -f
  ```
- **Inspect running containers:**
  ```bash
  docker ps
  ```
- **Stop and remove containers:**
  ```bash
  docker-compose down
  ```

---

### Method 2: Run Locally in Development Mode

Use this mode if you are actively making code changes to either the frontend or backend.

#### Step 1: Start the Database
Ensure MySQL is accessible locally on `localhost:3306` with the database `servicedesk_db`.

#### Step 2: Run the Backend (Spring Boot)
Open a terminal in the `backend/` directory:

```bash
cd backend

# Set environment variables (PowerShell):
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/servicedesk_db?createDatabaseIfNotExist=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME="servicedesk_user"
$env:SPRING_DATASOURCE_PASSWORD="ServiceDesk_Dev_2026"

# Run Spring Boot
.\mvnw.cmd spring-boot:run
```

*(On Linux / macOS bash)*:
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/servicedesk_db?createDatabaseIfNotExist=true&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="servicedesk_user"
export SPRING_DATASOURCE_PASSWORD="ServiceDesk_Dev_2026"

./mvnw spring-boot:run
```
The backend will start and listen on `http://localhost:8080`.

#### Step 3: Run the Frontend (React + Vite)
Open a second terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start at `http://localhost:5173`.

---

### Method 3: Run Automated Tests (Unit & E2E)

#### 1. Backend Unit and Integration Tests (JUnit 5 + H2)
Runs all controller and service layer unit tests using the fast in-memory H2 database:

```bash
cd backend
./mvnw test
# Windows:
# .\mvnw.cmd test
```
- Test reports are generated under: `backend/target/surefire-reports/`

#### 2. End-to-End (E2E) Browser UI Tests (Selenium + Pytest)
These tests launch a headless Microsoft Edge browser and validate page rendering, navigation, and form validation error messaging:

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
2. Install the required test packages:
   ```bash
   pip install -r tests/ui/requirements.txt
   ```
3. Ensure the Frontend and Backend are running, then execute the test suite:
   ```bash
   # Optional: set environment variables if custom paths are used
   # $env:FRONTEND_URL="http://localhost:5173"
   # $env:EDGEDRIVER_PATH="C:\tools\webdriver\msedgedriver.exe"

   pytest tests/ui/test_ui.py -v --junitxml=tests/ui/results.xml
   ```
- Automated failure screenshots are saved in `tests/ui/` if any test assertion fails.

---

### Method 4: Run Configuration Management with Ansible

Ansible automates server environment readiness and dependency provisioning (Git, OpenJDK 17, Maven, Curl, and certificates).

The configuration files reside in the `ansible/` directory.

#### Step 1: Open WSL or an Ubuntu/Debian Terminal
Ensure Ansible is installed:
```bash
sudo apt update && sudo apt install -y ansible
```

#### Step 2: Navigate to the Ansible Directory
```bash
cd ansible
```

#### Step 3: Execute the Playbook
Run the playbook against the local inventory:
```bash
ansible-playbook -i hosts.ini servicedesk-setup.yml -K
```
*(Enter your `sudo` password when prompted for `BECOME password`)*.

#### Step 4: Verify Idempotency
Run the playbook a second time:
```bash
ansible-playbook -i hosts.ini servicedesk-setup.yml -K
```
The **PLAY RECAP** will show `changed=0` and `failed=0`, verifying that the playbook is idempotent and safe for repeated execution.

---

### Method 5: Run CI/CD Pipeline with Jenkins

The declarative pipeline defined in [Jenkinsfile](./Jenkinsfile) automates the entire Continuous Integration and Continuous Deployment lifecycle.

#### Pipeline Stages:
1. **Checkout:** Clones the latest commit from the `main` branch of the Git repository.
2. **Backend - Build & Test:**
   - Runs `mvnw clean package` to compile Java code and execute JUnit tests.
   - Publishes test reports via `junit 'backend/target/surefire-reports/*.xml'`.
   - Archives the generated `*.war` application artifact.
3. **Frontend - Build:**
   - Runs `npm ci` for clean dependency installation.
   - Runs `npm run build` to create production-ready static assets.
   - Archives the `frontend/dist/` bundle.
4. **E2E UI Tests:**
   - Sets up Python virtual environment and installs Selenium dependencies.
   - Starts temporary instances of backend and frontend.
   - Polls `/actuator/health` and port 5173 until both services are ready.
   - Executes Pytest E2E tests in headless Edge.
   - Archives test logs, XML results, and failure screenshots.
5. **Docker Deploy:**
   - Tears down existing containers: `docker-compose down`.
   - Builds fresh images and restarts containers in detached mode: `docker-compose up --build -d`.

#### Triggering in Jenkins:
1. Ensure Jenkins agent has access to `docker`, `docker-compose`, Java 17, and Node.js.
2. Open Jenkins Dashboard -> Select `ServiceDesk-CICD` pipeline job.
3. Click **Build Now**.
4. Monitor the stage view and console output for build and deployment statuses.

---

## API Endpoints Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`ROLE_USER` by default) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT bearer token |

### Ticket Management Endpoints (`/api/tickets`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets` | Authenticated | Retrieve tickets (filtered by ownership for regular users) |
| `GET` | `/api/tickets/{id}` | Owner / Agent / Admin | Get detailed information for a specific ticket |
| `POST` | `/api/tickets` | Authenticated | Create a new support ticket |
| `PUT` | `/api/tickets/{id}` | Owner / Agent / Admin | Update title, description, or priority |
| `PATCH`| `/api/tickets/{id}/status` | Agent / Admin | Update ticket status and append resolution notes |
| `DELETE`| `/api/tickets/{id}` | Admin | Delete a ticket |

### System & Health Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/actuator/health` | Public | Application health status (`{"status":"UP"}`) |

---

## Roles & Permissions

| Feature / Action | `ROLE_USER` | `ROLE_AGENT` | `ROLE_ADMIN` |
| :--- | :---: | :---: | :---: |
| Register & Login | Yes | Yes | Yes |
| View Own Tickets | Yes | Yes | Yes |
| View All Tickets Across Organization | No | Yes | Yes |
| Create New Ticket | Yes | Yes | Yes |
| Edit Own Ticket Details | Yes | Yes | Yes |
| Change Ticket Status & Resolution Notes | No | Yes | Yes |
| Delete Ticket | No | No | Yes |

---

## DevOps Milestone Mapping

This project was built iteratively across a 12-week DevOps curriculum:

- **Week 1-3:** Problem Definition, Requirements Specification (SRS), Architecture Design, and Agile Planning.
- **Week 4-5:** Git repository initialization, branching strategy (`feat/*`), and Pull Request code review workflows.
- **Week 6:** MVP completion, baseline release packaging, and backend/frontend integration.
- **Week 7:** Continuous Integration setup with Jenkins, automated Maven builds, and JUnit reporting.
- **Week 8:** Pipeline automation, automated test execution, and deployment scripting.
- **Week 9-10:** End-to-End automated UI testing with Selenium WebDriver, headless browser execution, and screenshot capture.
- **Week 11:** Containerization with Docker — writing `Dockerfile` for backend and frontend, and multi-container orchestration with `docker-compose`.
- **Week 12:** Continuous Deployment with Docker via Jenkins pipeline, and Infrastructure Configuration Management using Ansible.