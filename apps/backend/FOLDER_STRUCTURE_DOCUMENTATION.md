# MOP Backend - Project Folder Structure Documentation

This document provides a comprehensive overview of the backend project structure, explaining the purpose of each folder, class, utility, and middleware. It serves as a standard reference for developers and LLM assistants working on this codebase.

## 📁 Root Directory Structure

```
backend/
├── src/
│   └── app/
│       ├── classes/          # Core application classes
│       ├── configs/          # Configuration management
│       ├── db/               # Database connection and setup
│       ├── errors/           # Error handling utilities
│       ├── middlewares/      # Express middleware functions
│       ├── routes/           # API route handlers
│       ├── schemas/          # Zod validation schemas
│       ├── types/            # TypeScript type definitions
│       └── utils/            # Utility functions
├── prisma/                   # Prisma ORM configuration
├── .env.*                    # Environment variable files
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🏗️ Core Architecture Overview

This is a **Node.js/Express.js backend** built with **TypeScript**, following a modular and scalable architecture pattern. The project uses:
- **Express.js** as the web framework
- **Prisma ORM** for database operations (PostgreSQL)
- **Zod** for runtime validation
- **JWT** for authentication
- **Custom error handling** with Express middleware

## 📂 Detailed Folder Structure

### 🗂️ `/src/app/classes/`

**Purpose**: Contains core application classes that provide foundational functionality.

**Files**:
- `AppError.ts` - Custom error class extending JavaScript Error

**Key Features**:
- Provides standardized error structure with status codes
- Captures stack traces automatically
- Used throughout the application for consistent error handling

```typescript
export class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    // Automatic stack trace capture
  }
}
```

**Usage**: Thrown in controllers/business logic to trigger proper error responses.

---

### ⚙️ `/src/app/configs/`

**Purpose**: Centralized configuration management for environment variables and settings.

**Files**:
- `env.ts` - Environment variable validation and management

**Key Features**:
- Uses **Zod** for runtime validation of environment variables
- Supports multiple environments (development, production, test)
- Fail-fast approach with detailed error messages for missing/invalid configs
- Type-safe environment variable access

**Environment Variables Managed**:
- Server configuration (PORT, NODE_ENV)
- Database connection (DATABASE_URL)
- JWT secrets and expiration times
- Cloudinary integration
- CORS origins
- Password hashing configuration

---

### 🗄️ `/src/app/db/`

**Purpose**: Database connection and Prisma client management.

**Files**:
- `index.ts` - Singleton Prisma client instance

**Key Features**:
- **Singleton pattern** to prevent multiple database connections
- Prisma client with comprehensive logging (query, error, warn)
- Development hot-reload support

**Usage**: Exported as `db` throughout the application for database operations.

---

### 🚨 `/src/app/errors/`

**Purpose**: Specialized error handling for different types of errors.

**Contains**:
- `handle-zod-error.ts` - Zod validation error formatting
- `handle-prisma-error.ts` - Prisma database error handling

**Key Features**:
- Transforms technical errors into user-friendly responses
- Maintains consistent error response structure
- Provides detailed error sources for debugging

---

### 🔧 `/src/app/middlewares/`

**Purpose**: Express middleware functions for request processing and authentication.

**Files**:
- `auth.ts` - JWT authentication and role-based access control
- `global-error-handler.ts` - Centralized error processing
- `not-found-handler.ts` - 404 error handling
- `validate-schema.ts` - Request validation middleware

**Key Features**:

#### Authentication Middleware (`auth.ts`)
- JWT token verification from Authorization header
- User existence validation in database
- Role-based access control (RBAC)
- Automatic user attachment to request object

#### Validation Middleware (`validate-schema.ts`)
- **Zod schema validation** for body, params, query
- Automatic type casting and validation
- Detailed error reporting for invalid requests
- Supports multi-target validation simultaneously

---

### 🛣️ `/src/app/routes/`

**Purpose**: API route definitions and business logic implementation.

**Structure**: Organized by resource/domain with consistent patterns

```
routes/
├── auth/                    # Authentication endpoints
│   ├── create-user.ts      # POST /auth/sign-up
│   ├── login-user.ts       # POST /auth/sign-in
│   └── index.ts           # Route export
├── categories/             # Category management
│   ├── create-category.ts
│   ├── update-categories.ts
│   ├── delete-categories.ts
│   ├── get-all-categories.ts
│   ├── get-category-details.tsx
│   ├── get-bulk-category-detail-for-export.ts
│   └── index.ts
├── category-add-ons/       # Category add-ons management
│   ├── create-category-add-on.ts
│   ├── remove-category-add-on.ts
│   └── index.ts
├── services/               # Service management
│   ├── create-services.ts
│   ├── update-services.ts
│   ├── delete-services.ts
│   ├── get-all-services.ts
│   ├── get-service-details.ts
│   ├── get-bulk-services-for-export.ts
│   └── index.ts
├── services-add-on/        # Service add-ons management
│   ├── add-service-addon.ts
│   ├── remove-service-addon.ts
│   └── index.ts
├── sliders/                # Hero slider management
├── users/                  # User management
│   ├── get-all-users.ts
│   └── get-me.ts
└── index.ts               # Main route aggregation
```

**Route Pattern Standards**:
1. **Consistent naming**: kebab-case for files, descriptive functions
2. **Error handling**: Uses `catchAsync` wrapper with `AppError`
3. **Validation**: Requires Zod schema validation
4. **Authentication**: Role-based access control where needed
5. **Response format**: Standardized via `sendApiResponse`

---

### 📝 `/src/app/schemas/`

**Purpose**: Zod validation schemas for request/response validation.

**Structure**: Mirrors the routes structure for organizational consistency

```
schemas/
├── auth/                   # Authentication schemas
│   ├── sign-up.ts         # User registration schema
│   └── index.ts
├── categories/             # Category validation schemas
│   ├── create-category.ts
│   ├── update-category.ts
│   ├── delete-category.ts
│   ├── get-all-categories.ts
│   ├── get-category-details.ts
│   ├── get-bulk-category-detail-for-export.ts
│   └── index.ts
├── category-add-ons/
├── services/
├── services-add-on/
└── index.ts
```

**Schema Standards**:
- **Type safety**: All schemas export their inferred types
- **Validation rules**: Comprehensive validation with meaningful messages
- **Transformation**: Data normalization and type casting
- **Reusability**: Composable schemas for different use cases

---

### 🔤 `/src/app/types/`

**Purpose**: TypeScript type definitions and interfaces.

**Files**:
- `response.ts` - API response type definitions
- `error-response.ts` - Error response structure types

**Key Interfaces**:
```typescript
interface IApiResponse<T, K> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
  pagination?: IPagination;
  summary?: K | null;
}

interface IErrorSource {
  message: string;
  path: string;
}
```

---

### 🛠️ `/src/app/utils/`

**Purpose**: Reusable utility functions and helpers.

**Files**:
- `catch-async.ts` - Async error wrapper for route handlers
- `send-api-response.ts` - Standardized response formatter
- `compare-hash.ts` - Password comparison utilities
- `hash-password.ts` - Password hashing
- `create-token.ts` - JWT token creation
- `verify-jwt-token.ts` - JWT token verification
- `seed-super-admin.ts` - Database seeding utilities

**Key Features**:

#### catchAsync Utility
- Wraps async route handlers for automatic error handling
- Prevents unhandled promise rejections
- Standardizes error handling pattern across all routes

#### Response Utilities
- Consistent API response structure
- Pagination support
- Type-safe response formatting

---

### 🗄️ `/prisma/`

**Purpose**: Database schema definition and migrations.

**Files**:
- `schema.prisma` - Database schema definition
- Migration files - Database structure evolution

**Database Models**:
- `User` - Authentication and authorization
- `Category` - Product/Service categories with hierarchical structure
- `Service` - Individual services under categories
- `CategoryAddon` - Text-based add-ons for categories
- `ServiceAddon` - Text-based add-ons for services
- `HeroSlider` - Homepage slider content

---

## 🔄 Data Flow Patterns

### Request Processing Flow
1. **Request hits Express router**
2. **Authentication middleware** (if protected route)
3. **Validation middleware** (Zod schema validation)
4. **Route handler** (wrapped in `catchAsync`)
5. **Business logic execution**
6. **Database operations** (via Prisma)
7. **Response formatting** (via `sendApiResponse`)
8. **Error handling** (via global error handler)

### Error Handling Pattern
```typescript
// Standard pattern across all controllers
export const createResource = catchAsync(async (req, res, next) => {
  try {
    // Business logic
    // Validation
    // Database operations
    // Success response
  } catch (error) {
    // Throw AppError for expected errors
    // Unexpected errors bubble to global handler
    throw new AppError(statusCode, "Error message");
  }
});
```

---

## 🎯 Development Standards

### Coding Conventions
- **TypeScript strict mode** enabled
- **ES6+ features** consistently used
- **Functional programming** patterns preferred
- **Arrow functions** for callbacks
- **Descriptive naming** for clarity

### File Organization
- **One file per major function** (e.g., create-category.ts)
- **Index files** for clean exports
- **Consistent naming** conventions
- **Logical grouping** of related functionality

### Error Handling Standards
- **Custom AppError** for known error cases
- **Global error handler** for consistent responses
- **Zod validation** for input validation
- **Proper HTTP status codes** for different error types

### Security Patterns
- **JWT-based authentication**
- **Role-based access control**
- **Input validation** on all endpoints
- **Environment variable management**
- **Password hashing** with bcrypt

---

## 📚 Usage Guidelines for LLM Assistants

When working on this codebase, follow these patterns:

### Adding New Endpoints
1. Create route handler with `catchAsync` wrapper
2. Define Zod schema in corresponding `/schemas/` folder
3. Include proper authentication/authorization
4. Use `AppError` for expected error cases
5. Export from route index file
6. Add to main routes index

### Error Handling
- **Never use direct `res.status()`** for errors in controllers
- **Always throw `AppError`** for known error conditions
- **Let global handler** process the error
- **Use proper HTTP status codes**

### Database Operations
- **Use singleton `db` client** from `/db/index.ts`
- **Wrap operations in transactions** for data consistency
- **Include proper error handling** for database constraints
- **Use Prisma includes** for optimized queries

### Validation
- **Define schemas** in `/schemas/` directory
- **Reuse common validation patterns**
- **Provide meaningful error messages**
- **Export inferred types** for TypeScript support

### Response Formatting
- **Always use `sendApiResponse`** utility
- **Consistent response structure** across all endpoints
- **Include pagination** for list endpoints
- **Type-safe response objects**

---

## 🔧 Configuration Management

### Environment Variables
The project uses multiple environment files:
- `.env.development` - Development configuration
- `.env.production` - Production configuration
- `.env.test` - Test configuration

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `ACCESS_TOKEN_SECRET` - JWT signing secret
- `REFRESH_TOKEN_SECRET` - JWT refresh token secret
- `CLOUDINARY_*` - Image upload configuration

---

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Set up environment**: Copy `.env.example` to `.env.development`
3. **Generate Prisma client**: `npm run db:generate`
4. **Run database migrations**: `npm run db:migrate`
5. **Start development server**: `npm run dev`

---

## 📋 Summary

This backend follows **clean architecture principles** with clear separation of concerns:
- **Presentation layer** (routes)
- **Business logic** (route handlers)
- **Data access** (Prisma/DB)
- **Cross-cutting concerns** (middleware, utils)
- **Infrastructure** (configs, types)

The structure is designed for **scalability**, **maintainability**, and **team collaboration**, making it easy for new developers (and LLM assistants) to understand and extend the codebase.

All patterns established should be **consistently followed** when adding new features or maintaining existing ones.
