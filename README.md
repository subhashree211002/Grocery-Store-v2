# Grocery Store Management System

## Overview

The Grocery Store Management System is a web application designed to manage grocery store operations, including product management, order tracking, and user authentication with role-based access control. The system leverages various technologies for backend, frontend, and asynchronous task handling.

## Technologies Used

- **Backend Framework**: Flask
- **Database**: SQLAlchemy (SQLite for development)
- **Asynchronous Task Queue**: Celery
- **Task Scheduling**: Celery Beat
- **Caching**: Redis
- **Frontend**: Vue.js
- **Styling**: Bootstrap & Custom CSS

## Features

1. User Authentication (Admin, Store Manager, Buyer)
2. Category & Product Management
3. Order Placement & Tracking
4. Scheduled Tasks for Reminders and Reports
5. Performance Optimization with Caching

## Prerequisites

Before starting, ensure the following are installed:

1. Python 3
2. Redis
3. Celery
4. Go (for MailHog)
5. Flask & Flask dependencies

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/grocery-store-management.git
   cd grocery-store-management
   ```

2. **Install Python dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run Database Migrations**:

   ```bash
   flask db upgrade
   ```

## Running the Application

To run the Grocery Store Management System, follow these steps, each in separate terminals:

1. **Run the Flask application**:

   ```bash
   python3 main.py
   ```

2. **Start Redis Server**:

   ```bash
   redis-server
   ```

3. **Start Celery Worker**:

   ```bash
   celery -A main:celery_app worker -l INFO
   ```

4. **Start Celery Beat Scheduler**:

   ```bash
   celery -A main:celery_app beat -l INFO
   ```

5. **Run MailHog** (For email notifications):

   ```bash
   ~/go/bin/MailHog
   ```

## Usage

Once the services are running:

- Open the browser and navigate to `http://localhost:5000/` to access the application.
- Login as an admin to manage categories, products, and user roles.
- Buyers can browse products, add items to the cart, and place orders.
- The system sends daily reminders and periodic reports automatically.

---
