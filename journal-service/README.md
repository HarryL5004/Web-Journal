# Getting Started
## Building the application
1. Clean the project: `./gradlew clean`
2. Run gradle build: `./gradlew build`

## Configuring the MongoDB connection
This project uses [MongoDB](https://www.mongodb.com/) for data storage. The database connection can be configured in `src/main/resources/application.yml`.

## Running the application
1. Start MongoDB.
2. Start the application: `java -jar <journal-service jar>`
3. Access the REST API with your browser (default: [http://localhost:8080/api](http://localhost:8080/api)).

This project preloads sample journals in the database using the `LoadDatabase` class. Remove or comment it out if needed.