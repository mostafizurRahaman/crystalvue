# Development Commands

This document explains all available npm scripts for development, building, and quality assurance.

## 🏗️ Build & Compilation Commands

| Command | Description |
|----------|-------------|
| `npm run build` | Compile TypeScript to JavaScript in `/dist` folder |
| `npm run build:check` | Type-check without emitting files (faster) |
| `npm run start` | Start the production server from compiled files |
| `npm run clean` | Remove the `/dist` build folder |

## 🛠️ Development Commands

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run dev:debug` | Start with Node.js debugging enabled |
| `npm run dev:full` | Clean and then start development server |

## 🔍 Code Quality Commands

| Command | Description |
|----------|-------------|
| `npm run lint` | Run ESLint on all TypeScript files |
| `npm run lint:fix` | Auto-fix ESLint issues where possible |
| `npm run lint:check` | Strict lint check (fails on any warnings) |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without changing files |
| `npm run type-check` | Run TypeScript type checking without emitting files |

## 🚀 Quality Assurance Commands

| Command | Description |
|----------|-------------|
| `npm run quality-check` | Run both lint:check and type-check |
| `npm run check-all` | Run lint:check, type-check, and build:check |
| `npm run ci` | Full CI/CD pipeline check (lint, type-check, build) |
| `npm run pre-commit` | Comprehensive pre-commit checks (recommended) |

## 🗄️ Database Commands

| Command | Description |
|----------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Prisma Studio for database management |
| `npm run db:reset` | Reset database (destructive) |
| `npm run db:deploy` | Deploy migrations to production |

## 🔄 Workflow Examples

### Daily Development
```bash
# Start development with hot-reload
npm run dev

# Or clean start if you want to rebuild everything
npm run dev:full
```

### Before Committing Code
```bash
# Recommended pre-commit workflow
npm run pre-commit

# Manual alternative
npm run lint:fix
npm run format
npm run build:check
```

### Full Quality Checks
```bash
# Quick quality check
npm run quality-check

# Comprehensive check (includes build check)
npm run check-all

# Full CI pipeline
npm run ci
```

### Troubleshooting
```bash
# Clean everything and reinstall
npm run clean:all

# Check for issues
npm run check-all
```

## Configuration Files

- **ESLint**: `.eslintrc.js` - Linting rules and configurations
- **TypeScript**: `tsconfig.json` - TypeScript compiler options
- **Prettier**: `.prettierrc` - Code formatting rules
- **Prisma**: `prisma/schema.prisma` - Database schema

## Environment Setup

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Generate Prisma client: `npm run db:generate`
4. Run database migrations: `npm run db:migrate`
5. Start development: `npm run dev`

## Production Deployment

1. Build the project: `npm run build`
2. Start production server: `npm run start`
3. Ensure all environment variables are set in production
