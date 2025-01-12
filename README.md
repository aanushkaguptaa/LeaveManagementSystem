# HCL Internship Project- Leave Management System

This guide provides a step-by-step process to set up the Leave Management System project, covering dependency installation, environment configuration, database setup, and application execution in both development and production environments.

---

## **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Directory Structure Overview](#directory-structure-overview)
    - [Pages Directory](#pages-directory)
    - [Src Directory](#src-directory)
3. [Installing Dependencies](#installing-dependencies)
4. [Environment Configuration](#environment-configuration)
5. [Setting Up Database Files](#setting-up-database-files)
6. [Data Import Script](#data-import-script)
7. [Running the Application](#running-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)

---

## **1. Prerequisites**

Ensure you have the following installed and configured:

- **[Node.js](https://nodejs.org/)** (Version 14 or higher)
- **[MongoDB](https://www.mongodb.com/)** (Local or a cloud instance via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## **2. Directory Structure Overview**

### **Pages Directory**

Defines application routing, with each file corresponding to a route:

**Admin Pages**

- `adminpage.jsx`: Dashboard for leave statistics and employee attendance.
- `attendanceOverview.jsx`: Attendance management page.

**User Pages**

- `userpage.jsx`: User dashboard for leave requests.
- `history.jsx`: Personal attendance records page.

**API Routes**

- `admin/`: API handlers for admin operations.
- `user/`: API handlers for user operations.

### **Src Directory**

#### **Components and Styles**

- `components/`: Reusable React components for:
    - Admin (`admin/`)
    - User (`user/`)
    - Shared (`common/`)
- `styles/`: CSS files for:
    - Admin (`admin/`)
    - User (`user/`)
    - Shared (`common/`)

#### **App, Contexts, and Utilities**

- `app/`: Main application logic and layout components.
- `contexts/`: Global state management providers.
- `utils/`: Common utility functions.

#### **Server Directory**

- `config/`: Database connection settings.
- `models/`: Mongoose models defining schemas.
- `database/`: Scripts and files for database management.
- `importData.js`: Script for importing CSV data into MongoDB.

---

## **3. Installing Dependencies**

1. Clone the repository:    

```
git clone https://github.com/aanushkaguptaa/LeaveManagementSystem 
cd leave-management-system
```

2. Install required packages:

    `npm install`

---

## **4. Environment Configuration**

1. Create a `.env` file in the root directory.
2. Add the following variables:

```
MONGODB_URI=<your_mongodb_connection_string> 
JWT_SECRET=<your_jwt_secret>
```  

	- Replace `<your_mongodb_connection_string>` with your MongoDB URI.
    - Replace `<your_jwt_secret>` with a secure JWT secret key.

---

## **5. Setting Up Database Files**

Update the CSV files (`employee.csv` and `request.csv`) in the `src/server/database` directory.

### **Example Formats**

**employee.csv**

`SAPID,name,password,role 12345678,John Doe,password123,employee 87654321,Jane Smith,password456,admin`

**request.csv**

`ID,type,from,to,takenOn,SAPID,reason,cancel 1,Full Day,2023-01-01,2023-01-01,2023-01-01,12345678,Personal,0 2,Half Day,2023-01-02,2023-01-02,2023-01-02,87654321,Medical,0`

Ensure correct formatting for smooth data import.

---

## **6. Data Import Script**

Run the script to populate MongoDB with CSV data:

`npm run import-data`

This will transfer data from `employee.csv` and `request.csv` into MongoDB collections.

---

## **7. Running the Application**

### **Development Mode**

1. Start the application in development mode:
    
    `npm run dev`
    
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Production Mode**

1. Build the application:
    
    `npm run build`
    
2. Start the production server:
    
    `npm start`
    
3. Access the application at [http://localhost:3000](http://localhost:3000).