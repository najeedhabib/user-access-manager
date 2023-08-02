# Step 1: Build the application using Maven
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Run the application using JRE
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/user-management-0.0.1-SNAPSHOT.jar .
EXPOSE 8081
CMD ["java", "-jar", "user-management-0.0.1-SNAPSHOT.jar"]