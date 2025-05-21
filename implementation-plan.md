# Project Phases for Fullstack Wallet & Admin App

## Phase 1: Project Foundation & Core Backend Setup

**Goal:** Establish the monorepo structure, set up the NestJS backend, and implement basic user authentication (foundational for both admin and user apps).  
**Tasks:**

- Initialize the monorepo (e.g., using Turborepo or Lerna).
- Scaffold the NestJS backend application.
  - _Copilot Assist:_ Generate modules and services for `Auth` and `Users`.
- Define initial database schemas (TypeORM entities) for Users.
  - _Copilot Assist:_ Suggest entity properties based on requirements (e.g., mobile number, OTP fields, roles).
- Implement Mobile Number Login via OTP.
  - Set up `node-otp` or a similar library.
  - Create endpoints for OTP generation and verification.
  - _Copilot Assist:_ Generate controller methods and service logic for OTP flow.
- Implement JWT-based session persistence.
  - _Copilot Assist:_ Configure Passport.js with JWT strategy.
- Set up basic logging and security (Helmet, CORS).
  - _Copilot Assist:_ Suggest common configurations.
- Initialize `shared-types` package for common data structures.

**Copilot Focus:** Boilerplate code for modules, services, controllers, entities, basic configurations, and simple utility functions.

## Phase 2: Admin Backend & Role-Based Access Control (RBAC)

**Goal:** Implement the backend functionalities for the admin dashboard and establish RBAC.  
**Tasks:**

- Backend:
  - Implement RBAC using Casbin or similar, defining roles (Super Admin, Finance Admin, Loyalty Manager).
    - _Copilot Assist:_ Generate Casbin policy definitions and middleware.
  - Develop Admin service with initial role-restricted functionalities:
    - User management
    - OTP Management
    - Security Logs viewing interface
    - Placeholders for future admin views
    - _Copilot Assist:_ Generate admin-specific service methods and controller endpoints with RBAC guards.

**Copilot Focus:** RBAC middleware, Casbin policy setup, admin-specific API endpoints and service logic.

## Phase 3: Admin Frontend Development

**Goal:** Develop the user interface for the Admin Dashboard.  
**Tasks:**

- Frontend:
  - Scaffold the React (Vite) frontend application or set up admin-specific routes/modules.
  - Set up state management (Redux Toolkit with RTK Query or React Query).
  - Develop UI for admin functionalities:
    - User management tables and forms.
    - OTP Management interface.
    - Security Logs display.
  - Implement chart views and filters (Recharts).
  - Basic responsive design and theme.
  - _Copilot Assist:_ Generate React components for data tables, forms, chart integration, API integration hooks.

**Copilot Focus:** Generating React components for admin UI, form handling, API integration for admin data, chart component setup.

## Phase 4: Wallet & GCash Integration (Backend)

**Goal:** Implement core wallet functionalities and integrate with the GCash API on the backend.  
**Tasks:**

- Define Wallet and Transaction database schemas.
  - _Copilot Assist:_ Generate TypeORM entities.
- Develop Wallet service:
  - View balance and history.
  - _Copilot Assist:_ CRUD for wallet transactions.
- Develop GCash service:
  - Integrate with GCash API for top-up and redemption.
  - _Copilot Assist:_ Generate API client code.
- Implement secure transaction processing logic.

**Copilot Focus:** API client generation, data mapping, service logic, entity generation.

## Phase 5: User-Facing Frontend (Wallet App Features)

**Goal:** Implement the user-facing mobile wallet features.  
**Tasks:**

- Frontend (User App):
  - Ensure frontend foundation is robust.
  - Implement Mobile Number Login UI.
  - Develop UI for:
    - Wallet Balance and History.
    - GCash Top-Up and Redemption.
  - Implement mobile UX with dark/light mode.
  - _Copilot Assist:_ Generate React components for wallet UI, forms, and API hooks.

**Copilot Focus:** Generating React components for user-facing UI, form handling, API integration hooks, styling.

## Phase 6: Machine Sessions & Real-time Features

**Goal:** Enable QR/NFC machine linking and real-time session updates.  
**Tasks:**

- Backend:
  - Define Machine and Session schemas.
  - Develop Machine Session service.
  - Implement real-time communication (WebSockets).
  - _Copilot Assist:_ Generate WebSocket gateway setup.
- Frontend:
  - Integrate QR scanner.
  - Develop UI for machine linking and session display.
  - Connect to backend WebSockets.
  - _Copilot Assist:_ Generate components for QR scanning, session data, WebSocket client.

**Copilot Focus:** WebSocket setup, real-time logic, session interaction UI.

## Phase 7: Loyalty Program

**Goal:** Implement the loyalty points and tier system.  
**Tasks:**

- Backend:
  - Define Loyalty schemas.
  - Develop Loyalty service.
  - _Copilot Assist:_ Implement loyalty rules, CRUD for rewards.
- Frontend:
  - Develop UI for loyalty display and redemption.
  - (Admin) UI for loyalty program management.
  - _Copilot Assist:_ Generate components for loyalty UI.

**Copilot Focus:** Business logic, endpoints, and frontend components.

## Phase 8: Non-Functional Requirements, Testing, Security & Deployment Prep

**Goal:** Ensure performance, security, and readiness for deployment.  
**Tasks:**

- End-to-end data encryption checks.
- Performance optimization (indexing, query optimization, caching).
  - _Copilot Assist:_ Indexing and cache suggestions.
- Write unit/integration tests.
  - _Copilot Assist:_ Test skeletons, mock API responses, suggested test cases.
- E2E tests (Cypress).
  - _Copilot Assist:_ Cypress scripts.
- Security hardening.
  - _Copilot Assist:_ Best practices and vulnerability reviews.
- CI/CD setup.
- Deployment configurations (Docker).
  - _Copilot Assist:_ Dockerfile and pipeline generation.
- Push notifications and alerts.

**Copilot Focus:** Test boilerplate, performance/security configurations, deployment prep.
