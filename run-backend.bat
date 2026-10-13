@echo off
echo ============================================================
echo Starting PrepPath Spring Boot Backend on http://localhost:8080
echo ============================================================
cd /d "%~dp0preppath-backend"
mvn spring-boot:run
pause
