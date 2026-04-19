# HealthcareSystem-DocNet
# 🏥 Healthcare System (Full-Stack)

A scalable full-stack healthcare platform built with **.NET Clean Architecture + Angular**.
This project focuses on real-world system design — modular, maintainable, and production-ready structure.

---

## 🚀 Tech Stack

### 🔹 Backend

* ASP.NET Core Web API
* Clean Architecture (API, Application, Domain, Infrastructure)
* Entity Framework Core
* PostgreSQL

### 🔹 Frontend

* Angular
* TailwindCSS

### 🔹 Integrations (Planned)

* FHIR (Medical Records Standard)
* Twilio (Video Consultation)
* SendGrid (Notifications)

---

## 📦 Project Structure

```
HealthcareSystem/
├── BackEnd/
│   ├── HealthcareSystem.API
│   ├── HealthcareSystem.Application
│   ├── HealthcareSystem.Domain
│   └── HealthcareSystem.Infrastructure
│
├── FrontEnd/
│   └── healthcare-client (Angular)
│
└── docker-compose.yml
```

---

## ✨ Features

* 🧑‍⚕️ Patient Management
* 📅 Appointment Booking System
* 🎥 Video Consultations (Planned)
* 📄 Medical Records (FHIR Integration Planned)
* 🔐 Authentication & Authorization (JWT - Planned)

---

## ⚙️ Getting Started

### 🔹 Backend

```bash
cd BackEnd/HealthcareSystem/src/HealthcareSystem.API
dotnet run
```

API will run on:

```
https://localhost:5001
```

Swagger:

```
https://localhost:5001/swagger
```

---

### 🔹 Frontend

```bash
cd FrontEnd/healthcare-client
npm install
ng serve
```

App runs on:

```
http://localhost:4200
```

---

## 🐳 Docker (Planned)

```bash
docker-compose up --build
```

---

## 🧠 Architecture Highlights

* Separation of concerns using Clean Architecture
* Modular Angular frontend (core, features, layout)
* Scalable API design (ready for microservices evolution)

---

## 🤝 Contributing

This project is open for collaboration.

Interested in:

* .NET backend
* Angular frontend
* DevOps / Docker
* System design

Feel free to fork, raise issues, or connect.

---

## 📌 Status

🚧 Currently in active development (Day-by-Day Build)

---

## 📬 Contact

* GitHub: https://github.com/Takesh-6890
* LinkedIn: (add your link)

---

## ⭐ Support

If you find this project useful, consider giving it a star.
