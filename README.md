
# Node.js & PostgreSQL Dockerized Application

This project is a Dockerized Node.js application connected to a PostgreSQL database. It's set up to ensure data persistence for the database and streamlined deployment of the Node.js server.

## Getting Started

These instructions will cover usage information and how to get the project up and running.

### Prerequisites

You'll need Docker and Docker Compose installed on your system to use this application. You can download and install Docker [here](https://docs.docker.com/get-docker/) and find Docker Compose installation instructions [here](https://docs.docker.com/compose/install/).

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://your-repository-url.git
   cd your-repository-name
   ```

2. **Set Up Environment Variables**

   Create a `.env` file in the project root. Update it with your environment-specific values:

   ```env
   # PostgreSQL Environment Variables
   POSTGRES_DB=your_database
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password

   # Node.js Environment Variables
   # Add any other environment variables your app requires
   ```

3. **Building and Running the Application**

   Use Docker Compose to build and run your application:

   ```bash
   docker-compose up --build
   ```

   This command will start the Node.js application and the PostgreSQL service.

### Usage

After starting the application, you can access:

- The Node.js application at: `http://localhost:5000`
- The PostgreSQL database on port `6000`

### Additional Commands

- To stop the application:

  ```bash
  docker-compose down
  ```

- To remove the volumes and start fresh:

  ```bash
  docker-compose down -v
  ```
