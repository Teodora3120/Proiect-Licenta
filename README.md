# Schedule Mate

Schedule Mate is a platform that connects workers and customers, allowing workers to add their services and customers to book desired services.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Features

- **Service Management**: Workers can add and manage their services.
- **Booking System**: Customers can browse services and book appointments.
- **User Authentication**: Secure user authentication for both workers and customers.
- **Dashboard**: Personalized dashboards for workers and customers.
- **Review and Rating**: Customers can provide feedback through reviews and ratings.
- **Responsive Design**: A user-friendly interface that works on various devices.

## Technologies

- **Frontend**: React
- **Backend**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: CSS and Bootstrap
- **Other Dependencies**: Reactstrap, .dotenv, socket.io, moment, axios, font-awesome

## Getting Started

To get a local copy of the project up and running, follow these steps:

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Teodora3120/Proiect-Licenta.git
cd frontend
npm install
cd backend
npm install
```

## Configuration

1. Create .env files in the root directory and add the necessary configuration variables.

# Example .env file for the backend

PORT=5000
JWT_SECRET=

# Example .env file for the frontend

REACT_APP_SERVER_URL=http://localhost:5000/

## Usage

1. Go to the backend folder

```bash
cd backend
npm run dev
```

2. Go to the frontend folder

```bash
cd frontend
npm run start
```
