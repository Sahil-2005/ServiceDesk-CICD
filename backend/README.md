# IT Service Desk Portal - Backend

This is the Spring Boot backend for the IT Service Desk Portal.

## Prerequisites

- Java 17
- Maven
- MySQL 8.4 (can be running in Docker)

## Configuration

The application uses environment variables for database configuration to avoid hardcoding secrets.

Set the following environment variables before running the application:

### Windows PowerShell

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/servicedesk_db"
$env:SPRING_DATASOURCE_USERNAME="servicedesk_user"
$env:SPRING_DATASOURCE_PASSWORD="your_password_here"
```

## Running Locally

To run the Spring Boot application locally:

```powershell
cd backend
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.

## Testing

To run the unit and integration test suite reproducibly:

```powershell
cd backend
mvn test
```

## Health Endpoint

You can check the availability of the backend using the Spring Actuator health endpoint:

```
GET http://localhost:8080/actuator/health
```
