# Project Requirements Document (PRD)

---

## 1. Document Control
- **Project Title:** Project LuckyPay
- **Project Manager:** Madel Floranza
- **Client:** CLIENT NAME
- **Date:** 2024-10-02
- **Version:** 1.0

---

## 2. Executive Summary / Purpose
Project LuckyPay aims to build a secure, mobile-friendly application that enables users to manage wallet-based transactions with casino machines using GCash. The project supports user loyalty programs, admin dashboards, and real-time monitoring of sessions and machines.

---

## 3. Scope
- **In Scope:** Wallet features (top-up, send/pull credits), session management, loyalty system, GCash integration, admin panel.
- **Out of Scope:** Integration with physical machine firmware, in-depth reporting analytics outside predefined metrics.

---

## 4. Objectives and Success Criteria
- Deploy mobile wallet app integrated with GCash.
- Enable real-time machine sessions using QR/NFC.
- Provide role-based admin dashboard.
- Launch loyalty points earning/redeeming system.
- Ensure end-to-end data encryption.

---

## 5. Assumptions and Constraints
- GCash API access is approved and stable.
- Users have Android/iOS devices with internet access.
- All wallet actions require user authentication.
- Limited to casino machines that support QR/NFC interaction.

---

## 6. Stakeholders and Roles
- **Product Owner:** Madel Floranza
- **Client Stakeholder:** SPAVI
- **Development Team:** Engineering, QA, DevOps
- **Admin Users:** Super Admin, Finance Admin, Loyalty Manager

---

## 7. Functional Requirements
Key features include:
- Mobile Number Login via OTP
- Session Persistence
- View Wallet Balance and History
- GCash Top-Up and Redemption
- QR/NFC Machine Link
- Admin Role-based Access
- Loyalty Program (Earn, Redeem, Tiers)
- OTP Management & Security Logs

---

## 8. Non-Functional Requirements
- **Performance:** Real-time session updates and push notifications
- **Availability:** 99.9% uptime SLA
- **Scalability:** Support for 100k+ active users

---

## 9. User Interface and Design Requirements
- Intuitive mobile UX with dark/light mode
- Admin dashboard with chart views and filters
- Alerts for transactions and system issues

---

## 10. Data Requirements
- User profile, wallet, loyalty points, machine session data
- Encrypted OTP and login logs
- Exportable reports for GCash transactions

---

## 11. Integrations
- GCash payment API
- Optional SMS gateway for OTP

---

## 12. Reporting and Analytics Requirements
- Real-time dashboard with active session counts
- Monthly GCash report with filters
- Loyalty report with redemption statistics

---

## 13. Acceptance Criteria
- All user stories listed in the feature set must meet their acceptance criteria.
- Admin functions are role-restricted and loggable.
- GCash payments successfully reflect in wallet within 10 seconds.

---

## 14. Milestones and Timeline
- Final Proposal: Completed
- Design & Planning: TBD
- Development Start: TBD
- Beta Testing: TBD
- Go-Live: TBD

---

## 15. Risks and Mitigations
- **GCash API downtime:** Implement retry mechanism and fallback notifications
- **Security breaches:** Regular audit, encryption enforcement
- **Session drop errors:** Implement reconnect and session integrity validation

---

## 16. Appendices
- Full feature list with user stories and acceptance criteria
- Glossary of terms (e.g., Wallet, Loyalty Points, Session)
- Wireframe mockups (to be provided separately)

---

## 17. Technical Requirements & Architecture

The application architecture will follow a modular and scalable design, leveraging widely adopted technologies for ease of development, maintainability, and deployment.

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Library:** 
  - Tailwind CSS with DaisyUI components
  - Material-UI (MUI) for complex components
  - React Native for mobile apps
- **State Management:** 
  - Redux Toolkit with RTK Query
  - React Query for caching and server state
- **Form Handling:** React Hook Form with Yup validation
- **Charts:** Recharts for analytics dashboards
- **Mobile Access:** 
  - Responsive web design with PWA capabilities
  - React Native for native mobile apps
- **Key Components:**
  - Authentication module (OTP verification)
  - Wallet dashboard (balance, transaction history)
  - GCash integration screens (top-up, withdrawal)
  - QR/NFC scanner using react-qr-reader
  - Loyalty program interface (points, tiers, rewards)
  - User profile management
  - Dark/Light theme toggle using next-themes
- **Testing:** 
  - Jest with React Testing Library
  - Cypress for E2E testing
  - MSW for API mocking
- **Code Quality:** 
  - ESLint with Airbnb config
  - Prettier
  - Husky for pre-commit hooks

### Backend
- **Framework:** 
  - NestJS with Express
  - TypeORM for database operations
- **API Documentation:** 
  - OpenAPI/Swagger
  - TypeDoc for code documentation
- **Authentication:**
  - Passport.js for JWT and OAuth
  - node-otp for OTP generation
  - Casbin for RBAC
- **Security:**
  - Helmet for security headers
  - CORS with whitelist
  - Rate limiting with express-rate-limit
  - bcrypt for password hashing
- **Validation:** 
  - class-validator
  - class-transformer
- **Core Services:**
  - User service: registration, authentication, profile management
  - Wallet service: balance management, transaction processing
  - GCash service: integration with GCash API for payments
  - Machine session service: QR/NFC session creation and management
  - Loyalty service: points calculation, tier management, redemption
  - Admin service: role-based dashboard capabilities, reporting
  - Notification service: push notifications, in-app alertt

### Database
- **Engine:** MySQL 8.0
- **ORM:** TypeORM with migrations
- **Caching:** 
  - Redis for session storage
  - ElastiCache for query caching
- **Schema Design:** Relational schema with normalization up to 3NF
- **Key Schema Components:**
  - Users: user profiles, authentication details, preferences
  - Wallets: balance tracking, transaction ledger
  - Transactions: detailed logs of all monetary movements
  - GCash: integration records, payment status tracking
  - Machines: machine registry, status monitoring
  - Sessions: active and historical machine usage records
  - Loyalty: points ledger, tier definitions, reward catalog
  - Admin: role definitions, permission sets
  - Audit: comprehensive system activity logs
- **Performance Optimizations:**
  - Indexes on frequently queried fields
  - Connection pooling
  - Query optimization

### System Architecture Diagram

```
┌─────────────────┐       ┌──────────────────────────┐       ┌─────────────────┐
│   Client Side   │       │      Server Side         │       │  External APIs  │
├─────────────────┤       ├──────────────────────────┤       ├─────────────────┤
│                 │       │                          │       │                 │
│  React Frontend ├───────┤ FastAPI Backend Services ├───────┤ GCash Payment   │
│    (PWA)        │       │                          │       │     API         │
│                 │       │  ┌──────────────────┐    │       │                 │
└─────────────────┘       │  │ Authentication   │    │       └─────────────────┘
                          │  │ Wallet           │    │       
                          │  │ Machine Sessions │    │       ┌─────────────────┐
                          │  │ Loyalty         │    │       │  Storage        │
                          │  │ Admin           │    │       ├─────────────────┤
                          │  └──────────────────┘    │       │                 │
                          │                          ├───────┤ MySQL Database  │
                          └──────────────────────────┘       │                 │
                                                             └─────────────────┘
```

### Security Architecture
- End-to-end data encryption for all communications
- Secure storage of sensitive user information
- Token-based authentication with short-lived tokens
- OTP verification for critical transactions
- Regular security audits and penetration testing
- Comprehensive audit logging of all system activities
