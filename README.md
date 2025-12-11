# 🌍 EcoCycle - Full-Stack Recycling Management Platform (MERN)

EcoCycle is a complete platform designed to incentivise recycling by providing citizens with a visual dashboard, gamified rewards, and scheduled waste pickup, while giving administrators the tools for full system oversight.

## ✨ Key Features Implemented

* **Multi-Role Authentication:** Separate logic and dashboards for Citizen, Collector, and Admin.
* **Secure Admin Gateway:** Uses a private code (`ECOADMIN`) check for registration.
* **Dynamic Citizen Dashboard:** Fetches live points (100 free points upon signup) and waste logging statistics from the database.
* **Waste Logging & Points System:** Citizens can log waste by type/weight, and the system automatically awards points (10 pts/KG).
* **Admin Waste Management:** Dedicated dashboard (`/admin/waste`) to view, filter, accept, or reject pending citizen requests.

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS | Modern, fast UI with professional styling. |
| **Backend** | Node.js, Express.js | Secure, scalable REST API. |
| **Database** | MongoDB, Mongoose | Flexible, non-relational data store. |

## 🚀 Setup and Run Locally

Follow these steps to get the project running on your local machine:

### 1. Backend Setup

1.  Navigate to the `server/` directory: `cd server`
2.  Install dependencies: `npm install`
3.  **Create `.env` file** in the `server/` directory and add your MongoDB connection string:
    ```
    MONGO_URI="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/ecocycle-db?retryWrites=true&w=majority"
    PORT=5000
    ```
4.  Start the server:
    ```bash
    node server.js
    ```
    *(The console must show "MongoDB connection established successfully.")*

### 2. Frontend Setup

1.  Navigate to the `client/` directory in a **new terminal window**: `cd client`
2.  Install dependencies: `npm install`
3.  Start the frontend application:
    ```bash
    npm run dev
    ```
4.  Open your browser to `http://localhost:5173`.

## 🔒 Test Credentials

| Role | Email | Password | Admin Code | Redirect |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | New User (e.g., test@mail.com) | 123456 | N/A | `/home` |
| **Admin** | New User (e.g., admin@mail.com) | 123456 | `ECOADMIN` | `/admin-panel` |
