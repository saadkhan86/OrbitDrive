# OrbitDrive — Complete Project Documentation

> **Author:** Saad Muhammad Bin Ramzan  
> **Version:** 1.0.0  
> **Stack:** Node.js · Fastify · TypeScript · PostgreSQL (Drizzle ORM) · Redis (BullMQ) · Nodemailer

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Architecture & Request Lifecycle](#7-architecture--request-lifecycle)
8. [Modules Deep Dive](#8-modules-deep-dive)
9. [Authentication & Security Flow](#9-authentication--security-flow)
10. [Email Verification Flow](#10-email-verification-flow)
11. [Password Reset Flow](#11-password-reset-flow)
12. [Scripts & Commands](#12-scripts--commands)
13. [Drizzle ORM & Migrations](#13-drizzle-orm--migrations)

---

## 1. Project Overview

**OrbitDrive** is a RESTful backend API built with **Fastify** and **TypeScript**. It provides:

- User **signup / login** with email & password
- **Email verification** via tokenised links
- **Forgot password** and **password reset** flows
- **User profile update** (protected endpoint)
- Asynchronous **email delivery** via BullMQ + Redis job queues
- **PostgreSQL** as the primary database (accessed via Drizzle ORM)
- JWT-based authentication (access tokens, refresh tokens, password-reset tokens)

---

## 2. Tech Stack & Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `fastify` | ^5.12.3 | HTTP web framework |
| `@fastify/jwt` | ^10.2.2 | JWT sign / verify plugin |
| `fastify-plugin` | ^6.0.0 | Fastify plugin helper |
| `fastify-type-provider-zod` | ^7.0.0 | Zod schema integration with Fastify |
| `zod` | ^4.6.1 | Request schema validation |
| `drizzle-orm` | ^0.45.2 | Type-safe ORM for PostgreSQL |
| `pg` | ^8.23.0 | PostgreSQL client (node-postgres) |
| `bullmq` | ^6.3.4 | Redis-backed job queue |
| `ioredis` | ^6.0.0 | Redis client |
| `nodemailer` | ^10.0.8 | Email transport |
| `argon2` | ^0.45.1 | Password hashing |
| `dotenv` | ^17.4.2 | Environment variable loader |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `tsx` | TypeScript execution + hot-reload watcher |
| `typescript` | TypeScript compiler |
| `drizzle-kit` | Drizzle CLI for migrations |
| `@types/node` | Node.js type definitions |
| `@types/nodemailer` | Nodemailer type definitions |
| `@types/pg` | pg type definitions |

---

## 3. Project Structure

```
OrbitDrive/
├── Src/
│   ├── server.ts                        # Application entry point
│   ├── Config/
│   │   ├── Redis.Config.ts              # Redis connection options
│   │   ├── StartServer.Config.ts        # Server startup (DB check + listen)
│   │   └── Transporter.Config.ts        # Nodemailer Gmail transporter
│   ├── Constants/
│   │   └── Constants.ts                 # App-wide constants (email templates, token TTL)
│   ├── Controller/
│   │   ├── auth.Controller.ts           # Handles auth HTTP request/response
│   │   ├── user.Controller.ts           # Handles user HTTP request/response
│   │   └── verification.Controller.ts   # Handles verification HTTP request/response
│   ├── Database/
│   │   ├── index.ts                     # Drizzle db instance + connection check
│   │   └── Schemas/
│   │       ├── users.Schema.ts          # users table definition
│   │       └── email_verification_tokens.Schema.ts
│   ├── Drizzle/
│   │   ├── 0000_dusty_devos.sql         # Initial migration
│   │   └── 0001_rare_big_bertha.sql     # Subsequent migration
│   ├── Errors/
│   │   ├── CustomError.ts               # Custom application error class
│   │   └── GlobalErrorHandler.ts        # Fastify global error handler
│   ├── Hooks/
│   │   ├── AuthenticationHook.ts        # JWT preHandler guard
│   │   └── ResponseTimeHook.ts          # X-Response-Time header plugin
│   ├── Interfaces/
│   │   └── IEmail.ts                    # TypeScript interfaces for email jobs
│   ├── Plugin/
│   │   └── JWTPlugin.ts                 # Registers @fastify/jwt + jwtUtils decorator
│   ├── Queues/
│   │   └── Email.Queue.ts               # BullMQ Queue for email jobs
│   ├── Repositories/
│   │   ├── Auth.Repo.ts                 # DB operations: signup, verify email
│   │   ├── User.Repo.ts                 # DB operations: find, update user
│   │   └── Verification.Repo.ts         # DB operations: token CRUD
│   ├── Router/
│   │   ├── Router.ts                    # Root router — mounts sub-routers
│   │   ├── auth.Router.ts               # /api/v1/auth routes
│   │   ├── user.Router.ts               # /api/v1/user routes
│   │   └── verification.Router.ts       # /api/v1/verification routes
│   ├── Services/
│   │   ├── auth.Service.ts              # Business logic: signup, login, password flows
│   │   ├── user.Service.ts              # Business logic: user update
│   │   ├── verification.Service.ts      # Business logic: email token verify / resend
│   │   └── Email.Service.ts             # Send email via nodemailer transporter
│   ├── Types/
│   │   └── fastify.d.ts                 # Fastify module augmentation (JWT payload types)
│   ├── Utils/
│   │   ├── JWTUtils.ts                  # JWT token generators (access, refresh, reset)
│   │   └── authTokenUtils.ts            # Crypto token generator + SHA-256 hasher
│   ├── Validators/
│   │   ├── user.Validator.ts            # Zod schemas: signup, login, update, passwordReset
│   │   ├── email.Validator.ts           # Zod schema: email only
│   │   └── token.Validator.ts           # Zod schema: 64-char token param
│   └── Workers/
│       └── Email.Worker.ts              # BullMQ Worker: processes email jobs
├── drizzle.config.ts                    # Drizzle Kit configuration
├── package.json
├── tsconfig.json
└── .env                                 # Environment variables (not committed)
```

---

## 4. Environment Variables

Create a `.env` file in the project root:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/orbitdrive` |
| `JWT_SECRET_KEY` | Secret key for signing JWTs | `super_secret_key_here` |
| `REDIS_HOST` | Redis server host | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |
| `EMAIL_USER` | Gmail address for sending emails | `youremail@gmail.com` |
| `EMAIL_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `VERIFICATION_URL` | Base URL of the frontend app | `http://localhost:3000` |
| `TOKEN_EXPIRE_TIME` | Token TTL in minutes (default: 15) | `15` |
| `EMAIL_JOB_CONCURRENCY` | BullMQ worker concurrency (default: 5) | `5` |

> **Note:** `EMAIL_USER`/`EMAIL_PASSWORD` require a Gmail **App Password** (not your account password). Enable 2FA first in Google Account settings.

---

## 5. Database Schema

### `users` Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default random | Unique user ID |
| `fullName` | `varchar(50)` | NOT NULL | User's display name |
| `provider` | `auth_provider` enum | NOT NULL, default `'password'` | Auth provider: `password` or `google` |
| `provider_user_id` | `varchar(255)` | nullable | OAuth provider user ID |
| `email` | `varchar(50)` | NOT NULL, UNIQUE | User email address |
| `passwordHash` | `varchar(255)` | NOT NULL | Argon2 password hash |
| `isEmailVerified` | `boolean` | NOT NULL, default `false` | Email verification status |
| `createdAt` | `timestamp` | NOT NULL, default now | Record creation time |
| `updatedAt` | `timestamp` | NOT NULL, default now | Record last update time |

**Unique constraint:** `(provider, provider_user_id)` — prevents duplicate OAuth accounts.

**Enum:** `auth_provider` → values: `'password'`, `'google'`

### `email_verification_tokens` Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default random | Token record ID |
| `user_id` | `uuid` | FK → `users.id` ON DELETE CASCADE | Owner user |
| `token_hash` | `varchar(64)` | UNIQUE, nullable | SHA-256 hash of the raw token |
| `expires_at` | `timestamptz` | nullable | Token expiry time |
| `claimed_at` | `timestamptz` | nullable | Timestamp when token was used |
| `created_at` | `timestamptz` | default now | Record creation time |

> Tokens are stored **hashed** (SHA-256). After use, `token_hash` and `expires_at` are nullified and `claimed_at` is stamped.

---

## 6. API Reference

**Base URL:** `http://localhost:8080`  
**API Prefix:** `/api/v1`

All request/response bodies are `application/json`.

**Standard Error Response Shape:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

---

### Health Check

#### `GET /ping`
No auth required. Returns `{ "message": "pong" }` with status `200`.

---

### Auth Routes — `/api/v1/auth`

---

#### `POST /api/v1/auth/signup`

Register a new user. Sends email verification link.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Validation:**
- `fullName`: string, 3–50 chars
- `email`: valid email
- `password`: string, 6–30 chars

**Response `201`:**
```json
{ "message": "Account created successfully!, Check your email for verification" }
```

**Errors:**

| Status | Code | Trigger |
|---|---|---|
| `409` | `EMAIL_ALREADY_EXISTS` | Email already registered (verified or pending) |
| `400` | `Validation_ERROR` | Invalid request body |

**Side Effect:** Enqueues `email-verification` job → sends verification email.

---

#### `POST /api/v1/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Response `200`:**
```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "provider": "password",
    "providerUserId": null,
    "isEmailVerified": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

> `passwordHash` is stripped from the response.

**Errors:**

| Status | Code | Trigger |
|---|---|---|
| `401` | `USER_NOT_FOUND` | Email not registered |
| `403` | `EMAIL_VERIFICATION_PENDING` | Email not yet verified |
| `401` | `INVALID_CREDENTIALS` | Wrong password |

---

#### `POST /api/v1/auth/forgot-password`

Initiates password reset. Sends reset link via email.

**Request Body:**
```json
{ "email": "john@example.com" }
```

**Response `201`:**
```json
{ "success": true, "message": "Password reset email has been sent" }
```

**Errors:**

| Status | Code | Trigger |
|---|---|---|
| `404` | `USER_NOT_FOUND` | Email not registered |
| `403` | `EMAIL_NOT_VERIFIED` | User email not verified |

**Side Effect:** Enqueues `password-reset` job → sends reset email with JWT link.

---

#### `PATCH /api/v1/auth/password-reset`

🔒 **Protected** — requires `Authorization: Bearer <password-reset-jwt>`

Reset the user's password.

**Request Body:**
```json
{ "password": "newSecurePass456" }
```

**Response `200`:**
```json
{ "message": "Password reset successfully" }
```

**Errors:**

| Status | Code | Trigger |
|---|---|---|
| `401` | `FST_JWT_AUTHORIZATION_TOKEN_EXPIRED` | Token expired |
| `401` | `INVALID_ACCESS_TOKEN` | Wrong token type |
| `400` | `Validation_ERROR` | Invalid body |

---

### Verification Routes — `/api/v1/verification`

---

#### `GET /api/v1/verification/email/:token`

Verify email using the 64-char token from the email link.

**URL Params:** `token` — 64-character hex string

**Response `200`:**
```json
{ "success": true, "message": "Email verified successfully" }
```

**Errors:**

| Status | Code | Trigger |
|---|---|---|
| `400` | `INVALID_TOKEN` | Token not found |
| `400` | `TOKEN_ALREADY_USED` | Token already claimed |
| `400` | `TOKEN_EXPIRED` | Token past expiry |
| `500` | `COULD_NOT_VERIFY` | DB update failed |

**Side Effects (all inside a transaction):**
- Nullifies `token_hash` and `expires_at`
- Sets `claimed_at = NOW()`
- Sets `users.isEmailVerified = true`

---

#### `POST /api/v1/verification/email/resend`

Resend verification email to an unverified user.

**Request Body:**
```json
{ "email": "john@example.com" }
```

**Response `201`:**
```json
{ "success": true, "message": "Verification email has been sent" }
```

**Errors:**

| Status | Code | Trigger |
|---|---|---|
| `404` | `USER_NOT_FOUND` | Email not registered |
| `409` | `ALREADY_VERIFIED` | User already verified |
| `500` | `SOMETHING_WENT_WRONG` | No token record for user |

---

### User Routes — `/api/v1/user`

🔒 **All routes protected** — requires `Authorization: Bearer <access-jwt>`

---

#### `PATCH /api/v1/user/update`

Update the authenticated user's profile.

**Request Body (all fields optional):**
```json
{
  "fullName": "New Name",
  "passwordHash": "optional_value"
}
```

**Response `200`:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "fullName": "New Name",
    "email": "john@example.com",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## 7. Architecture & Request Lifecycle

```
Client Request
      │
      ▼
┌─────────────────────┐
│    Fastify Server   │  logger, Zod validators, global error handler
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Plugins / Hooks   │  ResponseTimeHook → JWTPlugin → AuthenticationHook (preHandler)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│       Router        │  /api/v1 → authRouter | userRouter | verificationRouter
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│     Controller      │  Extract validated body/params → call Service → send reply
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│      Service        │  Business logic, orchestrate Repos + Queue
└────────┬────────────┘
         │
      ┌──┴──┐
      │     │
      ▼     ▼
┌──────┐  ┌─────────┐
│ Repo │  │  Queue  │
│ (DB) │  │ (Redis) │
└──────┘  └────┬────┘
               │
               ▼
         ┌──────────┐
         │  Worker  │  Processes email jobs asynchronously
         └────┬─────┘
              │
              ▼
         ┌──────────────┐
         │ Email Service │  Nodemailer → Gmail SMTP
         └──────────────┘
```

---

## 8. Modules Deep Dive

### 8.1 Server Bootstrap — `Src/server.ts`

1. Creates `Fastify({ logger: true })` instance
2. Registers `ResponseTimeHook` plugin
3. Registers `JWTPlugin` (attaches `@fastify/jwt` + `jwtUtils` decorator)
4. Sets Zod `validatorCompiler` and `serializerCompiler`
5. Sets `GlobalErrorHandler`
6. Registers `GET /ping` health-check route
7. Registers main router under prefix `/api/v1`
8. Sets up graceful shutdown on `SIGINT`/`SIGTERM` (closes `EmailWorker` + Fastify)
9. Calls `StartServer(server)` — connects DB then listens on port 8080

---

### 8.2 Router — `Src/Router/Router.ts`

Mounts sub-routers with prefixes:

| Sub-Router | Prefix |
|---|---|
| `authRouter` | `/auth` |
| `userRouter` | `/user` |
| `verificationRouter` | `/verification` |

---

### 8.3 Controllers

Thin layer — extract data, call service, send response.

| File | Methods |
|---|---|
| `auth.Controller.ts` | `signup`, `login`, `forgotPassword`, `passwordReset` |
| `user.Controller.ts` | `update` |
| `verification.Controller.ts` | `verifyEmailVerification`, `resendEmailVerification` |

---

### 8.4 Services

#### `authService` — `auth.Service.ts`

| Method | Description |
|---|---|
| `signup(data)` | Check email uniqueness → hash password (argon2) → generate & hash token → DB transaction (insert user + token) → enqueue email job |
| `login(data)` | Find user → check verification → verify argon2 hash → return user without passwordHash |
| `forgotPassword(email, tokenGenerator)` | Find verified user → generate JWT reset token → enqueue password-reset email job |
| `passwordReset(userId, { password })` | Hash new password → update user record |

#### `verificationService` — `verification.Service.ts`

| Method | Description |
|---|---|
| `verifyEmailVerification({ token })` | Hash token → look up DB → validate claimedAt + expiresAt → mark token used + set isEmailVerified = true (transaction) |
| `resendEmailVerification(email)` | Find unverified user → generate new token → update token record → enqueue email job |

#### `userService` — `user.Service.ts`

| Method | Description |
|---|---|
| `update(userId, data)` | Delegates to `UserRepo.update` |

#### `sendEmailService` — `Email.Service.ts`

Builds verification URL by type, selects email template from Constants, sends via nodemailer pooled transporter.

---

### 8.5 Repositories

Singletons exported via `new Repo()`. All DB access uses Drizzle ORM.

#### `AuthRepo`

| Method | Description |
|---|---|
| `signup(tx, data)` | Insert user, return id/fullName/email/isEmailVerified/createdAt |
| `updateIsEmailVerified(tx, id)` | Set isEmailVerified = true where id matches and currently false |

#### `UserRepo`

| Method | Description |
|---|---|
| `findByEmail(email)` | Select first user matching email |
| `findById(id)` | Select first user matching UUID |
| `update(id, data)` | Update fullName/passwordHash, return id/fullName/email/updatedAt |

#### `VerificationRepo`

| Method | Description |
|---|---|
| `create(tx, data)` | Insert token record (userId, tokenHash, expiresAt) |
| `findByTokenHash(tx, hash)` | Find token by hashed value |
| `findByUserId(userId)` | Find token by owner user ID |
| `update(tx, data)` | Selectively update tokenHash, expiresAt, claimedAt |

---

### 8.6 Validators (Zod Schemas)

#### `user.Validator.ts`

| Schema | Fields | Rules |
|---|---|---|
| `signupValidator` | fullName, email, password | fullName 3–50; email valid; password 6–30 |
| `loginValidator` | email, password | email valid; password 6–30 |
| `updateValidator` | fullName?, passwordHash? | fullName 3–50 optional; passwordHash optional |
| `passwordResetValidator` | password | password 6–30 |

#### `email.Validator.ts` — `{ email }` — valid email format

#### `token.Validator.ts` — `{ token }` — exactly 64 characters

---

### 8.7 Plugins — `Plugin/JWTPlugin.ts`

Wrapped with `fastify-plugin` for global scope.

- Registers `@fastify/jwt` with `process.env.JWT_SECRET_KEY`
- Decorates Fastify instance with `app.jwtUtils` (token generator functions)

---

### 8.8 Hooks

#### `AuthenticationHook` — `preHandler` guard on protected routes

1. Calls `request.jwtVerify()` to validate Bearer token
2. Checks `request.user.type` is `"access"` or `"password-reset"`
3. Throws `CustomError(401, "Invalid access token")` on type mismatch

#### `ResponseTimeHook` — Fastify plugin

- `onRequest`: captures `performance.now()` → `request.startTime`
- `onSend`: calculates elapsed time → sets `X-Response-Time` header

---

### 8.9 Error Handling

#### `CustomError` class

```typescript
class CustomError extends Error {
  statusCode: number;  // HTTP status
  message: string;     // Human-readable message
  code: string;        // Machine-readable error code
}
```

#### `GlobalErrorHandler` — priority order

| Priority | Error Type | HTTP Response |
|---|---|---|
| 1 | `pg.DatabaseError` | `500 DATABASE_ERROR` |
| 2 | `CustomError` | `error.statusCode + error.code` |
| 3 | JWT errors (`FST_JWT_*`) | `401` or `error.statusCode` |
| 4 | Zod validation errors | `400 Validation_ERROR` |
| 5 | All others | `500 INTERNAL_SERVER_ERROR` |

All errors are logged via `request.log.error` before responding.

---

### 8.10 Queue & Worker System

#### `EmailQueue` — `Queues/Email.Queue.ts`

BullMQ Queue named `"email"`:
- **5 retry attempts** on failure
- **Exponential backoff** starting at 1000ms
- `removeOnComplete: true` — auto-cleans completed jobs

#### `EmailWorker` — `Workers/Email.Worker.ts`

Processes jobs from the `"email"` queue:

| Job Name | Action |
|---|---|
| `"email-verification"` | Calls `sendEmailService("email", ...)` |
| `"password-reset"` | Calls `sendEmailService("password-reset", ...)` |

**Worker config:**
- Concurrency: `EMAIL_JOB_CONCURRENCY` (default 5)
- Lock duration: 60 seconds
- Max stalled: 2, stalled interval: 30 seconds

**Events:** `completed`, `failed`, `error` — all logged with timing info.

Gracefully closed in `SIGINT`/`SIGTERM` shutdown handler.

---

### 8.11 JWT Utilities — `Utils/JWTUtils.ts`

`CreateJWTUtils(app)` returns the `jwtUtils` object on the Fastify instance:

| Method | Payload | Expiry |
|---|---|---|
| `generateAccessToken(id)` | `{ userId, type: "access" }` | 12 hours |
| `generateRefreshToken(id)` | `{ userId, type: "refresh" }` | 30 days |
| `generatePasswordResetToken(id)` | `{ userId, type: "password-reset" }` | TOKEN_EXPIRE_TIME minutes |
| `verifyPasswordResetToken(token)` | — | — |

**JWT Payload Type** (`Types/fastify.d.ts`):
```typescript
{
  userId: string;
  type: "access" | "refresh" | "password-reset";
}
```

---

### 8.12 Token Utilities — `Utils/authTokenUtils.ts`

Used for **email verification tokens** (not JWTs):

| Method | Description |
|---|---|
| `generateToken(size = 32)` | Generates `size`-byte random hex string (32 bytes = 64 hex chars) |
| `hashToken(token)` | SHA-256 hashes the token for DB storage |

The **raw** token goes to the user. Only the **hash** is persisted in the database.

---

### 8.13 Email Service — `Services/Email.Service.ts`

`sendEmailService(type, email, verificationToken, expiresIn, fullName)`

URL generation:
- `email` type: `{VERIFICATION_URL}/verification/email/{token}`
- `password-reset` type: `{VERIFICATION_URL}/auth/password-reset/{token}`

Uses `Constants.emailVerification` or `Constants.passwordReset` templates for `text` and `html` body.

---

### 8.14 Constants — `Constants/Constants.ts`

| Key | Description |
|---|---|
| `tokenExpireTime` | Token TTL in minutes (env var or 15) |
| `emailVerification.subject(fullName)` | Email subject function |
| `emailVerification.text(url, minutes)` | Plain-text email body function |
| `emailVerification.html(url, minutes)` | HTML email body with styled "Verify Email" button |
| `passwordReset.subject(fullName)` | Email subject function |
| `passwordReset.text(url, minutes)` | Plain-text email body function |
| `passwordReset.html(url, minutes)` | HTML email body with styled "Reset Password" button |

---

### 8.15 Interfaces & Types

#### `Interfaces/IEmail.ts`

```typescript
namespace IEmail {
  interface create {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }
  interface EmailVerificationJob {
    email: string;
    verificationToken: string;
    expiresIn: number;
    fullName: string;
  }
  interface update {
    id: string;
    tokenHash?: string | null;
    expiresAt?: Date | null;
    claimedAt?: Date | null;
  }
}
```

#### `Types/fastify.d.ts`

Module augmentation:
- `FastifyInstance.jwtUtils: JWTUtils`
- `FastifyJWT.payload` and `FastifyJWT.user` typed with `userId` + `type`

---

### 8.16 Config Files

| File | Purpose |
|---|---|
| `Config/Redis.Config.ts` | BullMQ `ConnectionOptions` — reads REDIS_HOST/PORT, sets `maxRetriesPerRequest: null` |
| `Config/StartServer.Config.ts` | Checks DB connection, starts Fastify on port 8080 |
| `Config/Transporter.Config.ts` | Pooled Nodemailer Gmail transporter (max 3 connections) |

---

## 9. Authentication & Security Flow

```
Signup:
  Client → POST /auth/signup
    → Check email uniqueness
    → argon2.hash(password)
    → crypto.randomBytes(32).toString("hex") → token
    → sha256(token) → tokenHash
    → DB Transaction:
        INSERT INTO users
        INSERT INTO email_verification_tokens
    → Enqueue email-verification job
    ← 201 Created

Login:
  Client → POST /auth/login
    → Find user by email
    → Check isEmailVerified = true
    → argon2.verify(storedHash, inputPassword)
    → Return user (without passwordHash)
    ← 200 + user data
```

**Password security:** Argon2 — resistant to GPU and side-channel attacks.

**Token security:** 32 random bytes (64 hex chars). Only SHA-256 hash stored in DB. Even if the DB is compromised, raw tokens cannot be recovered.

---

## 10. Email Verification Flow

```
1. Signup → raw 64-char token generated → SHA-256 hash stored in DB
2. Email sent: {VERIFICATION_URL}/verification/email/{raw_token}
3. User clicks link → frontend calls:
   GET /api/v1/verification/email/{raw_token}
4. Server:
   a. SHA-256 hashes the received token
   b. Looks up token_hash in DB
   c. Validates: record exists? claimedAt is null? not expired?
   d. DB Transaction:
      - Set claimedAt = NOW(), tokenHash = null, expiresAt = null
      - Set users.isEmailVerified = true
5. User is verified and can now log in

Resend:
  POST /api/v1/verification/email/resend { email }
  → New token generated → token record updated → new email enqueued
```

---

## 11. Password Reset Flow

```
1. POST /auth/forgot-password { email }
   → Find verified user
   → app.jwtUtils.generatePasswordResetToken(userId)
      Produces JWT: { userId, type: "password-reset" } exp: TOKEN_EXPIRE_TIME min
   → Enqueue password-reset email job

2. Email: {VERIFICATION_URL}/auth/password-reset/{jwt_token}
   (Frontend shows "New Password" form, submits with JWT in Authorization header)

3. PATCH /auth/password-reset { password: "newPass" }
   Header: Authorization: Bearer {jwt_token}
   → AuthenticationHook: jwtVerify() → validates type = "password-reset"
   → argon2.hash(newPass)
   → UserRepo.update(userId, { passwordHash })
   ← 200 Password reset successfully

Token is single-use by expiry (15 minutes default).
```

---

## 12. Scripts & Commands

```bash
# Development with hot-reload
npm run dev

# Build TypeScript → dist/
npm run build

# Start production server
npm start

# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations to DB
npx drizzle-kit migrate

# Open Drizzle Studio (browser-based DB GUI)
npx drizzle-kit studio
```

---

## 13. Drizzle ORM & Migrations

**Config:** `drizzle.config.ts`

```typescript
{
  schema: "./Src/Database/Schemas/*.ts",  // Source of truth
  out: "./Src/Drizzle",                   // SQL migration output
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL }
}
```

**Migrations in `Src/Drizzle/`:**

| File | Content |
|---|---|
| `0000_dusty_devos.sql` | Creates `auth_provider` enum, `users` table, `email_verification_tokens` table with FK |
| `0001_rare_big_bertha.sql` | Subsequent schema changes |

The `db` instance (`Database/index.ts`) uses a node-postgres `Pool`. `checkDatabaseConnection()` runs `SELECT 1` on startup to verify DB is reachable before the server begins accepting traffic.

---

*Documentation generated: September 2026*
