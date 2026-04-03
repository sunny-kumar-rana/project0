# Local Services Web App

## Overview

A full-stack web application that connects users with local service providers. Users can browse services and make bookings, while providers can list services and manage booking requests.

This project is currently in a **hybrid stage**:

* Frontend: HTML, CSS, JavaScript
* Backend: Java Servlets (in progress integration)
* Storage: Transitioning from localStorage → backend memory

---

## Features Implemented

### 1. Homepage

* Displays all available services
* Dynamic service cards rendered via JavaScript
* File: 

---

### 2. Authentication System (Frontend → Backend Migration)

* User registration (stored in localStorage currently)
* Login system (being migrated to servlet-based session)
* Role-based users:

  * User
  * Service Provider
* Files:

  *
  *

---

### 3. Dynamic Navbar

* Changes based on login state and role
* Shows:

  * Login / Dashboard / Add Service / Logout
* Controlled via JavaScript
* Logic: 

---

### 4. Service Management

#### Add Service (Provider Only)

* Providers can add services with:

  * Title
  * Category
  * Price
  * Location
  * Description
* File: 

#### View Services

* Services displayed as cards
* Click → opens detailed view
* File: 

---

### 5. Booking System

* Users can book services
* Prevents duplicate bookings
* Booking status:

  * pending
  * accepted
  * rejected

---

### 6. Dashboard

* Role-based dashboard:

#### Provider Dashboard

* View bookings for their services
* Accept / Reject bookings

#### User Dashboard

* View own bookings

* File: 

---

### 7. UI / Styling

* Dark theme UI
* Responsive grid layout for services
* Card-based design with hover effects
* Styles: 

---

## Current Architecture

### Frontend

* HTML pages for UI
* JavaScript for logic and rendering
* CSS for styling

### Backend (In Progress)

* Java Servlets:

  * LoginServlet
  * UserServlet (`/me`)
  * ServiceServlet
  * BookingServlet

### Data Handling

* Current:

  * localStorage (users, services, bookings)
* Migrating to:

  * Servlet-based in-memory storage
* Future:

  * Oracle Database

---

## Project Structure

```
/project-root
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── add-service.html
│   └── service.html
└── java/
    └── servlets (in progress)
```

---

## Current Limitations

* Data not persistent (server restart clears services/bookings)
* Mixed architecture (localStorage + backend)
* No database integration yet
* No validation/security beyond basic checks

---

## Next Steps

1. Complete migration to backend:

   * Remove all localStorage usage
   * Fully rely on Servlets

2. Integrate Database:

   * Oracle DB for users, services, bookings

3. Improve UI/UX:

   * Better navigation consistency
   * Add loading states
   * Improve responsiveness

4. Refactor Architecture:

   * Move toward REST API + clean separation
   * Future: Spring Boot + React

---

## Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Java Servlets
* Build Tool: Maven
* Database (planned): Oracle

---

## Status

**Functional full-stack prototype (without database)**
Core features working, backend integration in progress.

---
