# 🚀 Node-bazaar Microservice 🛒 

This project is an implementation of an Node-bazaar platform using a microservice architecture.

## 💁🏻‍♂️ Services

The project is divided into several microservices, each responsible for a single business capability:

1. **User Service**: Handles user registration, authentication, and profile management.
2. **Product Catalog Service**: Manages product information, categories, and search functionality.
3. **Cart Service**: Manages the shopping cart where users can add, update, or remove products.
4. **Order Service**: Handles order creation, payment processing, and order status updates.
5. **Payment Service**: Manages payment processing, typically integrating with a third-party payment gateway.
6. **Review Rating Service**: Manages customer reviews and ratings for products. This service allows users to post reviews and rate products, and also aggregates these reviews and ratings to provide overall scores for products.
7. **Notification Service**: Handles all notifications sent to users. This could include order status updates, payment confirmations, promotional messages, and more. This service typically integrates with email, or in app notification services to deliver notifications.

## ⚙️ Running the Services

Each service is a separate application and needs to be run individually. Here are the general steps to run each service:

1. **Install Dependencies**: Run `npm install` to install all necessary dependencies.

2. **Set Environment Variables**: Each service has its own set of environment variables that need to be set. These are typically stored in a `.env` file in the root of the service's directory.

3. **Install Docker and Docker Compose**: If you haven't already, install Docker and Docker Compose on your machine. You can find the installation instructions on the official Docker website.

4. **Build the Docker Images**: Navigate to the root directory of the project where the `docker-compose.yml` file is located. Run `docker-compose build` to build the Docker images for the services.

5. **Start the Services**: Run `docker-compose up` to start the services. Docker Compose will start the services in the background and display the logs in the terminal.

6. **Check the Services**: You can check if the services are running by navigating to their URLs in a web browser or using a tool like Postman to send a request to the service's API.

To stop the services, use the `docker-compose down` command. To rebuild and restart the services after making changes, use the `docker-compose up --build` command.

## 📚 API Documentation

Each service in this project has a Swagger UI for API documentation and testing. Once the services are running, you can access the Swagger UI for each service by navigating to `/api` on the service's URL.

For example, if the Auth Service is running on `http://localhost:3000`, you can access its Swagger UI at `http://localhost:3000/api`.

The Swagger UI allows you to view the API endpoints for each service, their request parameters, and response formats. You can also send requests to the API endpoints directly from the Swagger UI.

## 🛠️ Tools & Technology Used

This project uses a variety of technologies to create a microservice architecture:

- **[NestJS](https://nestjs.com/)**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

- **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.

- **[Docker](https://www.docker.com/)**: A platform to develop, ship, and run applications inside containers.

- **[MongoDB](https://www.mongodb.com/)**: A source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

- **[Redis](https://redis.io/)**: An open-source, in-memory data structure store, used as a database, cache, and message broker.

- **[Jest](https://jestjs.io/)**: A delightful JavaScript Testing Framework with a focus on simplicity.

- **[Swagger](https://swagger.io/)**: An open-source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful web services.

- **[Stripe](https://stripe.com/)**: An online payment processing platform that allows businesses to send and receive payments over the internet.

- **[SendGrid](https://sendgrid.com/)**: A cloud-based SMTP provider that allows you to send email without having to maintain email servers. SendGrid manages all of the technical details, from scaling the infrastructure to ISP outreach and reputation monitoring to whitelist services and real time analytics.
