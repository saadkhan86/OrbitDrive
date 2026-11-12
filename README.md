# OrbitDrive

**A Multi-Tenant Business Management & Collaboration Backend**

OrbitDrive is a modular, backend-focused SaaS project built with Node.js, Fastify, TypeScript, and PostgreSQL. It is designed to support organizations, team collaboration, client management, sales pipelines, task tracking, notifications, activity tracking, and real-time communication.

The project follows a layered architecture to keep business logic, database operations, request handling, and infrastructure concerns separated.

## Features

### Authentication & Security
- User registration and login.
- JWT-based authentication.
- Access, refresh, and password-reset token generation.
- Email verification with secure token hashing.
- Forgot password and password reset workflows.
- Argon2 password hashing.
- Request validation using Zod.
- Global error handling.
- API rate limiting.

### Organization Management
- Create and manage organizations.
- Organization ownership and membership.
- Role-based access control.
- Organization member management.
- Invitation-based organization onboarding.
- Organization-specific data isolation.

### CRM & Business Management
- Client management.
- Client status tracking.
- Deal and sales pipeline management.
- Deal stages: Lead, Qualified, Proposal, Negotiation, Won, and Lost.
- Task creation and assignment.
- Task priorities and status tracking.
- Client and deal-related activities.

### Collaboration & Communication
- Conversation and conversation-member management.
- Direct and group conversation architecture.
- Message management.
- Socket.IO integration with JWT authentication.
- Conversation room handling.
- Organization-specific notifications.
- Notification read/unread tracking.

### Activity & Audit Tracking
- Record business activities such as calls, emails, meetings, and notes.
- Organization-level audit logs.
- Track create, update, delete, invite, and join actions.
- Store structured metadata using PostgreSQL JSONB.

### Background Processing & Caching
- Redis integration.
- BullMQ-based asynchronous email processing.
- Email verification and password-reset jobs.
- Automatic job retries with exponential backoff.
- Redis-based caching utilities.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Type safety |
| Fastify 5 | HTTP server and API framework |
| PostgreSQL | Relational database |
| Drizzle ORM | Type-safe database queries |
| Redis | Caching and queue infrastructure |
| BullMQ | Background job processing |
| Socket.IO | Real-time communication |
| JWT | Authentication |
| Argon2 | Password hashing |
| Zod | Request validation |
| Nodemailer | Email delivery |
| Swagger / OpenAPI | API documentation |

## Architecture

OrbitDrive follows a modular layered architecture:

```text
Client
  |
  v
Fastify Server
  |
  v
Plugins & Hooks
  |
  v
Router
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
PostgreSQL (Drizzle ORM)
```

Additional infrastructure:

```text
Service
  |
  +------ Redis / BullMQ
  |          |
  |          v
  |        Worker
  |          |
  |          v
  |       Nodemailer
  |
  +------ Redis Cache
  |
  +------ Socket.IO
```

Each layer has a dedicated responsibility:

- **Router:** Defines API endpoints and middleware.
- **Controller:** Handles HTTP requests and responses.
- **Service:** Contains business logic and coordinates operations.
- **Repository:** Handles database queries and persistence.
- **Database:** Contains Drizzle schemas and database configuration.
- **Config:** Manages infrastructure initialization and application configuration.

## Project Structure

```text
OrbitDrive/
├── Src/
│   ├── Caching/
│   ├── Config/
│   ├── Constants/
│   ├── Controller/
│   ├── Database/
│   │   └── Schemas/
│   ├── Errors/
│   ├── Hooks/
│   ├── Interfaces/
│   ├── Plugin/
│   ├── Queues/
│   ├── Repositories/
│   ├── Router/
│   ├── Services/
│   ├── Socket/
│   ├── Types/
│   ├── Utils/
│   ├── Validators/
│   ├── Workers/
│   └── server.ts/
├── drizzle.config.ts
├── .env.example
├── DOCUMENTATION.md
├── package.json
└── tsconfig.json
```

## API Overview

All API endpoints use the following base prefix:

```text
/api/v1
```

| Module | Endpoint Prefix |
|---|---|
| Health Check | `/ping` |
| Authentication | `/auth` |
| Email Verification | `/verification` |
| Users | `/users` |
| Organizations | `/organization` |
| Organization Invitations | `/organization-invitation` |
| Organization Members | `/organization-member` |
| Clients | `/:organizationId/client` |
| Deals | `/:organizationId/deal` |
| Tasks | `/:organizationId/task` |
| Activities | `/:organizationId/activity` |
| Conversations | `/conversations` |
| Conversation Members | `/:conversationId` |
| Messages | `/:conversationId` |
| Notifications | `/notification` |
| Audit Logs | `/:organizationId/audit-log` |

### API Documentation

Swagger UI is configured at:

```text
http://localhost:8080/swagger
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL
- Redis

### 1. Clone the Repository

```bash
git clone https://github.com/saadkhan86/OrbitDrive.git

cd OrbitDrive
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URI=postgresql://username:password@localhost:5432/orbitdrive

JWT_SECRET_KEY=your_jwt_secret

TOKEN_EXPIRE_TIME=15

VERIFICATION_URL=http://localhost:3000

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_app_password

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_JOB_CONCURRENCY=5

APP_URL=http://localhost:8080

PHASE=DEVELOPMENT
```

Replace the placeholder values with your actual configuration.

### 4. Run Database Migrations

Generate migrations after schema changes:

```bash
npx drizzle-kit generate
```

Apply migrations:

```bash
npx drizzle-kit migrate
```

### 5. Start Redis

Make sure your Redis server is running and accessible using the configured host and port.

### 6. Start Development Server

```bash
npm run dev
```

The API server runs on:

```text
http://localhost:8080
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with TSX watch |
| `npm run build` | Compile TypeScript |
| `npm start` | Start compiled production server |
| `npx drizzle-kit generate` | Generate database migrations |
| `npx drizzle-kit migrate` | Apply database migrations |
| `npx drizzle-kit studio` | Open Drizzle Studio |

## Database

OrbitDrive uses PostgreSQL with Drizzle ORM.

The database currently includes schemas for:

- Users
- Organizations
- Organization Members
- Organization Invitations
- Clients
- Deals
- Tasks
- Activities
- Notifications
- Audit Logs
- Conversations
- Conversation Members
- Messages

UUIDs are used for primary identifiers, with foreign-key relationships to maintain data integrity.

## Development Philosophy

OrbitDrive is being developed with an emphasis on:

- Modular programming.
- Separation of concerns.
- Scalable backend architecture.
- Type-safe database operations.
- Secure authentication and authorization.
- Multi-tenant application design.
- Reusable business logic.
- Maintainable and extensible code.

The goal is to build a practical SaaS backend that goes beyond basic CRUD operations and incorporates real-world business workflows.

## Project Status

OrbitDrive is an actively developed project. Features are being implemented incrementally, with ongoing improvements to the architecture, business modules, and collaboration infrastructure.

---

**Built by Saad Muhammad Bin Ramzan**

[GitHub](https://github.com/saadkhan86) · [Portfolio](https://saadmuhammad.vercel.app/)
