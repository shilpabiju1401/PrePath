# Stage 1: Build application with Maven and Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies for caching
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN mkdir -p /app/data && chmod 777 /app/data
COPY --from=builder /app/target/preppath-backend-*.jar app.jar

# Dynamic PORT provided by Render
ENV PORT=8081
EXPOSE ${PORT}

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
