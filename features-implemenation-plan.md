# Copilot-Optimized Implementation Plan for LuckyPay Features

## Phase 1: Monorepo & Core Backend Foundation

**Goal:** Establish project structure, core backend, and user authentication.

- Initialize monorepo (Turborepo/Lerna).
- Scaffold NestJS backend.
- Define initial TypeORM entities: User (mobile, OTP, roles).
- Implement Mobile Number Login via OTP.
  - Copilot: Generate Auth/User modules, OTP service, controller endpoints.
- Implement JWT session persistence.
  - Copilot: Passport.js JWT strategy, session middleware.
- Set up logging, security (Helmet, CORS).
- Create `shared-types` package.

**Copilot Prompts:**

- "Generate NestJS Auth/User modules and OTP flow endpoints."
- "Suggest User entity fields for OTP login and RBAC."

---

## Phase 2: Admin Backend & RBAC

**Goal:** Implement admin backend, RBAC, and admin authentication.

- Define Admin entity, roles (Super Admin, Finance Admin, etc.).
- Implement Admin login (username/password).
- Set up RBAC (Casbin or custom guards).
- Add endpoints for:
  - User management (search, suspend, adjust wallet)
  - OTP policy management
  - Security logs, admin activity logs
- Copilot: Generate Casbin policies, RBAC middleware, admin endpoints.

**Copilot Prompts:**

- "Create Casbin policy for admin roles and permissions."
- "Generate admin controller endpoints with RBAC guards."

---

## Phase 3: Admin Frontend

**Goal:** Build React admin dashboard for all admin user stories.

- Scaffold React (Vite) admin app.
- Set up state management (Redux Toolkit/RTK Query).
- Implement UI for:
  - User management, OTP management, wallet adjustments
  - GCash transactions, reports, session monitoring
  - Loyalty management, rewards catalog, redemption approvals
  - Visual charts (Recharts), dashboard metrics
- Copilot: Generate data tables, forms, chart components, API hooks.

**Copilot Prompts:**

- "Generate React data table for user management."
- "Create chart component for cash-in trends."

---

## Phase 4: Wallet & GCash Integration (Backend)

**Goal:** Implement wallet, GCash top-up, and transaction history.

- Define Wallet, Transaction entities.
- Implement Wallet service (balance, history, credit/debit).
- Integrate GCash API (top-up, redemption).
- Enforce transaction limits, logging.
- Copilot: Generate API client, transaction logic, entity definitions.

**Copilot Prompts:**

- "Generate TypeORM entities for Wallet and Transaction."
- "Implement GCash API integration for top-up."

---

## Phase 5: User-Facing Frontend (Wallet App)

**Goal:** Build user mobile/web app for wallet features.

- Scaffold React Native or web app.
- Implement:
  - Mobile Number Login UI
  - Wallet balance/history
  - GCash top-up, redemption
  - Machine session linking (QR/NFC)
  - Loyalty dashboard, notifications
- Copilot: Generate forms, QR scanner, session UI, API hooks.

**Copilot Prompts:**

- "Generate React Native login form for OTP."
- "Create QR scanner component for machine linking."

---

## Phase 6: Machine Sessions & Real-Time Features

**Goal:** Enable machine linking, session management, and real-time updates.

- Define Machine, Session entities.
- Implement session service (start, end, pull credits).
- Set up WebSocket gateway for real-time updates.
- Copilot: Generate WebSocket gateway, session endpoints.

**Copilot Prompts:**

- "Generate NestJS WebSocket gateway for session updates."
- "Implement session start/end endpoints."

---

## Phase 7: Loyalty Program

**Goal:** Implement loyalty points, tiers, and rewards.

- Define Loyalty, Reward entities.
- Implement loyalty rules (earn, redeem, tier logic).
- Admin endpoints for rule config, catalog management.
- User endpoints for points, redemption.
- Copilot: Generate CRUD endpoints, business logic.

**Copilot Prompts:**

- "Generate endpoints for earning/redeeming loyalty points."
- "Implement admin UI for rewards catalog management."

---

## Phase 8: Non-Functional, Security, Testing & Deployment

**Goal:** Ensure security, performance, and deployment readiness.

- Enforce HTTPS, encrypt sensitive data.
- Optimize DB (indexes, caching).
- Write unit/integration/E2E tests (Jest, Cypress).
- Set up CI/CD, Docker deployment.
- Implement push notifications, system alerts.
- Copilot: Generate test skeletons, Dockerfiles, CI configs.

**Copilot Prompts:**

- "Generate Jest test for OTP verification endpoint."
- "Create Dockerfile for NestJS backend."

---

## Copilot Agent Mode Usage Tips

- Use Copilot chat for rapid endpoint, entity, and UI generation.
- Prompt for test cases, security best practices, and deployment scripts.
- Leverage Copilot for repetitive CRUD, form, and table scaffolding.
- Iterate with Copilot for business logic and edge case handling.

---
