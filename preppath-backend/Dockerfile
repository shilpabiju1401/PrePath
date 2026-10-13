# Stage 1: Build application with Maven and Java 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image with Python3, GCC, and Java compiler for in-container code execution
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
RUN apk add --no-cache python3 gcc g++ musl-dev && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    mkdir -p /app/data && chmod 777 /app/data
COPY --from=builder /app/target/preppath-backend-*.jar app.jar

# Dynamic PORT provided by Render
ENV PORT=8081
EXPOSE ${PORT}

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
