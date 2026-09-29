# ♻️ RecyBridge — Kabadiwala Connect

### Connecting Informal E-Waste Collectors with Formal Recyclers

**RecyBridge (Kabadiwala Connect)** is a web-based platform designed to create a digital bridge between informal e-waste collectors and formal recyclers.

The platform digitizes the e-waste collection process by providing structured collection requests, estimated value calculation, photo uploads, recycler-side request management, pickup workflows, and digital traceability.

---

## 🚀 Project Overview

The informal e-waste collection sector has strong last-mile reach, but collectors may face difficulties such as:

* Limited access to formal recyclers
* Unclear value information
* Manual communication and coordination
* Unstructured collection records
* Limited visibility of the e-waste journey

RecyBridge addresses this gap by connecting **Collectors** and **Recyclers** through a structured digital workflow.

### 🔗 Core Workflow

**Collector → Collection Request → Estimated Value → Recycler → Pickup → Completion → Traceability**

---

## 🎯 Problem Statement

**Problem Statement ID:** 26229

The existing informal e-waste collection network already provides valuable last-mile collection services, but there is a lack of a structured digital connection between informal collectors and formal recycling organizations.

RecyBridge provides this missing digital bridge.

---

## 💡 Key Features

### 👤 Collector

* Collector registration and login
* Create e-waste collection requests
* Select e-waste material
* Enter weight
* Enter pickup location
* Enter contact number
* Select pickup date
* Upload e-waste photograph
* View estimated value
* Track collection status
* View collection history
* Manage profile

### ♻️ Recycler

* Recycler registration and login
* View collection requests
* View collector information
* View material and weight
* View uploaded e-waste photographs
* Assign collector
* Accept requests
* Mark requests as Picked Up
* Complete requests
* Reject requests
* View e-waste journey
* View traceability ID
* View collection analytics

---

## 🔄 Collection Workflow

```text
Collector Login
      ↓
Create Collection
      ↓
Material + Weight
      ↓
Pickup Details
      ↓
Upload Photo
      ↓
Estimated Value
      ↓
Pending
      ↓
Recycler Dashboard
      ↓
Assign Collector
      ↓
Accepted
      ↓
Picked Up
      ↓
Completed
```

A request can also follow:

```text
Pending → Rejected
```

---

## 🆔 Digital Traceability

Every collection receives a unique reference ID such as:

```text
KC-XXXXXXXX
```

The platform maintains timestamped status history for the e-waste collection.

### E-Waste Journey

```text
Request Created
      ↓
Collector Assigned
      ↓
Collection Accepted
      ↓
E-Waste Picked Up
      ↓
Collection Completed
```

This converts an otherwise unstructured collection process into a digitally documented journey.

---

## 💰 Estimated Value Calculation

The current MVP uses predefined material-based rates.

| Material |    Rate |
| -------- | ------: |
| Mobile   | ₹500/kg |
| Laptop   | ₹600/kg |
| Computer | ₹400/kg |
| Monitor  | ₹350/kg |
| Battery  | ₹250/kg |

### Example

If:

```text
Material = Mobile
Weight = 5 kg
Rate = ₹500/kg
```

Then:

```text
Estimated Value = 5 × ₹500
                = ₹2,500
```

> **Note:** The current MVP uses rule-based estimated pricing and does not use live market pricing.

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Other Technologies

* Multer — image upload handling
* bcryptjs — password hashing
* express-session — session management
* dotenv — environment variables
* Git & GitHub — version control
* Render — deployment

---

## 🏗️ System Architecture

```text
                    USER
                      │
             ┌────────┴────────┐
             │                 │
        COLLECTOR           RECYCLER
             │                 │
             └────────┬────────┘
                      ↓
                Web Browser
                      ↓
               HTML + CSS + EJS
                      ↓
                 JavaScript
                      ↓
             Node.js + Express
                │          │
                │          └──────→ Multer
                │                    │
                │                E-Waste Photo
                ↓
               Mongoose
                  ↓
             MongoDB Atlas
                  ↓
          Collection Database
                  ↓
        Status History / Traceability
```

---

## 🔐 Authentication & Security

RecyBridge implements role-based authentication.

### Registration Flow

```text
User Registration
      ↓
Check Existing Email
      ↓
Hash Password using bcryptjs
      ↓
Create User
      ↓
Save in MongoDB
```

### Login Flow

```text
Login
  ↓
Find User
  ↓
Check Role
  ↓
Verify Password
  ↓
Create Session
  ↓
Open Appropriate Dashboard
```

### Security Features

* Password hashing using `bcryptjs`
* Server-side sessions using `express-session`
* Role-based authorization
* Protected routes
* Environment variables for sensitive configuration
* Separate Collector and Recycler permissions

---

## 📁 Project Structure

```text
kabadiwala-connect/
│
├── app.js
├── .env
├── .gitignore
├── package.json
│
├── public/
│   └── css/
│       └── style.css
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── collector.ejs
│   ├── recycler.ejs
│   └── profile.ejs
│
├── models/
│   ├── User.js
│   ├── Collector.js
│   └── Collection.js
│
└── uploads/
```

---

## 🗄️ Database Structure

### User

```text
User
├── Name
├── Email
├── Password
├── Role
└── Created At
```

### Collection

```text
Collection
├── Material
├── Weight
├── Value
├── Collector
│   ├── Collector ID
│   ├── Name
│   ├── Phone
│   └── Area
├── Pickup Location
├── Contact Number
├── Pickup Date
├── Status
├── Status History
├── Photo
└── Created At
```

### Status History

```text
Status History
├── Status
└── Timestamp
```

---

## 📊 Dashboard

### Collector Dashboard

The Collector dashboard provides:

* Collection statistics
* Total weight
* Total estimated earnings/value
* Collection records
* Add E-Waste functionality

### Recycler Dashboard

The Recycler dashboard provides:

* Collection analytics
* Pending requests
* Accepted requests
* Picked Up requests
* Completed requests
* Rejected requests
* Material-wise collections
* Collection details
* E-Waste Journey

---

## 📸 E-Waste Image Upload

Collectors can upload photographs of collected e-waste.

The current MVP uses **Multer** for handling image uploads.

```text
Collector selects/captures image
          ↓
Form submitted
          ↓
Multer processes image
          ↓
Image stored in uploads/
          ↓
Image path stored with collection
          ↓
Recycler can view photo
```

---

## 🌐 Deployment

### Database

MongoDB Atlas

### Hosting

Render

### Start Command

```bash
node app.js
```

### Live Application

https://recybridge.onrender.com

### GitHub Repository

https://github.com/ronaklohar438-arch/RecyBridge

---

## 📌 Current Implementation

| Feature                    | Status        |
| -------------------------- | ------------- |
| Collector Registration     | ✅ Implemented |
| Recycler Registration      | ✅ Implemented |
| Login                      | ✅ Implemented |
| Role-Based Access          | ✅ Implemented |
| Collection Creation        | ✅ Implemented |
| Material Entry             | ✅ Implemented |
| Weight Entry               | ✅ Implemented |
| Estimated Value            | ✅ Implemented |
| Photo Upload               | ✅ Implemented |
| Recycler Dashboard         | ✅ Implemented |
| Collector Assignment       | ✅ Implemented |
| Accept Request             | ✅ Implemented |
| Pickup Status              | ✅ Implemented |
| Complete Request           | ✅ Implemented |
| Reject Request             | ✅ Implemented |
| Traceability ID            | ✅ Implemented |
| Timestamped Status History | ✅ Implemented |

---

## 🔮 Future Scope

The following features are planned as future-stage capabilities:

### 🤖 AI

* Image-based material classification
* AI-assisted valuation
* Anomaly detection

### 📍 Location

* GPS-based pickup verification
* Location-based recycler recommendation

### 💰 Pricing

* Live / near-real-time price discovery
* Historical transaction-based pricing
* Verified recycler rates

### 📱 Mobile

* Dedicated Android application
* Offline-first synchronization

### 🌐 Language

* Hindi support
* Marathi support
* Voice-assisted interface

### ☁️ Storage

* Persistent cloud image storage

### ♻️ Recycler Verification

* Verified recycler database
* Automated authorization verification

---

## 🌱 Benefits

### For Collectors

* Digital collection records
* Estimated value visibility
* Better recycler connectivity
* Collection history
* More organized workflow

### For Recyclers

* Structured collection requests
* Collector information
* Material and weight information
* Easier pickup management
* Collection analytics

### For the E-Waste Ecosystem

* Better documentation
* Improved traceability
* Structured collection data
* Better connection between informal and formal sectors

---

## ⭐ Unique Value Proposition

> **"We don't replace the informal collector — we connect their existing last-mile network with the formal recycling ecosystem."**

RecyBridge focuses on creating a structured digital connection between the existing informal collection network and formal recycling channels.

---

## ⚠️ Current MVP Limitations

The current MVP does **not** claim the following as implemented:

* Live market-price API
* AI material classification
* AI valuation
* GPS verification
* Offline-first operation
* Automatic recycler authorization verification
* Production-grade persistent image storage

These capabilities are part of the future scope.

---

## 👨‍💻 Team / Project

**Project:** RecyBridge — Kabadiwala Connect
**Problem Statement ID:** 26229
**Project Type:** Web Application
**Version:** Hackathon MVP

---

## 📄 License

This project was developed as a hackathon project / MVP.
