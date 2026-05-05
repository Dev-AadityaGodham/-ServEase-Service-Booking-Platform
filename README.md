readme = ServEase – Local Service Booking Platform

ServEase is a full-stack local service booking platform that connects customers with service providers. It supports service discovery, provider profiles, booking requests, request acceptance/rejection, work completion, optional extra charge approval, booking history, and reviews.

This project is built to demonstrate real-world full-stack development using Spring Boot and React.

---

## Preview

![ServEase Screenshot 1](https://res.cloudinary.com/dhdl1glbm/image/upload/v1777956100/Screenshot_2026-05-05_095441_kyohtn.png)

![ServEase Screenshot 2](https://res.cloudinary.com/dhdl1glbm/image/upload/v1777956100/Screenshot_2026-05-05_095510_foydfr.png)

![ServEase Screenshot 3](https://res.cloudinary.com/dhdl1glbm/image/upload/v1777956100/Screenshot_2026-05-05_095747_mascdl.png)

![ServEase Screenshot 4](https://res.cloudinary.com/dhdl1glbm/image/upload/v1777956100/Screenshot_2026-05-05_095534_qojgg0.png)

![ServEase Screenshot 5](https://res.cloudinary.com/dhdl1glbm/image/upload/v1777956100/Screenshot_2026-05-05_095609_mb7a2w.png)

---

## Features

### User Features
- User registration and login
- Browse available services
- View providers offering selected services
- Book a service provider
- View booking history
- Approve or reject extra charges
- Submit reviews after service completion

### Provider Features
- Create provider profile
- Add offered services with custom pricing
- View incoming booking requests
- Accept or reject booking requests
- Mark work as done
- Request optional extra charges after work
- View provider booking history

### System Features
- Booking lifecycle management
- Extra charge approval workflow
- Review and rating system
- Toast notifications
- Loading states
- Responsive UI
- Auto-refresh/polling for booking updates

---

## Tech Stack

### Frontend
- React
- Vite
- Axios
- Custom CSS

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- REST APIs

### Database
- PostgreSQL

---

## Core Workflow

```text
Customer registers/logs in
        ↓
Customer browses services
        ↓
Customer selects provider and books service
        ↓
Provider receives incoming request
        ↓
Provider accepts or rejects request
        ↓
Provider marks work as done
        ↓
Optional extra charge request
        ↓
Customer approves/rejects extra charge
        ↓
Booking completed
        ↓
Customer gives review
