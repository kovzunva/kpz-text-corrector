# TextGuard Studio

Interactive text correction and dictionary management web service featuring custom rule resolution, pagination offset mapping, user dictionary synchronization, and live analytics.

---

## 1. Technology Stack

- **Frontend**: Next.js (App Router, React, TypeScript strict mode)
- **UI System**: Material UI (MUI v6) strictly wrapped via custom design-system components (`App*`)
- **Styling**: Scoped CSS Modules + centralized theme design tokens. Inline styles (`style={{}}`) and inline MUI prop styles (`sx={{}}`) are strictly prohibited.
- **Backend**: NestJS (Modular Architecture, Fastify/Express)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Access + Refresh tokens in HttpOnly cookies), guest sessions managed via IP rate-limiting
- **External Integration**: LanguageTool Public API (wrapped with backend fallback and rule filtering)

---

## 2. Engineering & Development Rules

### 2.1 Component Architecture & MUI Wrapping Rule
Direct imports from `@mui/material` or `@mui/icons-material` inside domain pages, widgets, or features are prohibited.
- All MUI primitives must reside in `@/shared/ui/` with the `App` prefix:
  - `Button` -> `AppButton`
  - `TextField` -> `AppTextField`
  - `Tooltip` -> `AppTooltip`
  - `Card` -> `AppCard`
  - `Modal` -> `AppModal`
- Every `App*` component must expose strictly-typed props extending the respective MUI interface while binding custom tokens and scoped CSS Module classes.

### 2.2 Styling Constraints
- Strict rule: **No inline styling (`style={{ ... }}` or `sx={{ ... }}`)**.
- Visual design must rely solely on scoped `*.module.css` files referencing theme design tokens (CSS variables defined at root).

### 2.3 Strict Typing & Code Standards
- Strict TypeScript configuration (`"strict": true`, `"noImplicitAny": true`).
- Usage of `any` or untyped data structures is forbidden.
- Shared domain contracts (DTOs, entity models, category enums) must be synchronized between client and server.
- Verbose block comments are prohibited; code must be self-explanatory with minimal one-line tags strictly for non-trivial formulas.

---

## 3. Repository Structure
├── apps/
│   ├── web/                     # Next.js Application
│   │   ├── src/
│   │   │   ├── app/             # App Router: /, /editor, /dictionary, /auth
│   │   │   ├── entities/        # User, Issue, Dictionary Rule models
│   │   │   ├── features/        # Editor canvas, Pagination, File import
│   │   │   ├── shared/
│   │   │   │   └── ui/          # Wrapped App* UI primitives
│   │   │   └── styles/          # Variables, CSS modules, design tokens
│   └── api/                     # NestJS Application
│       ├── src/
│       │   ├── modules/
│       │   │   ├── text-engine/ # External API, filtering, pagination offset logic
│       │   │   ├── dictionary/  # User rules management CRUD
│       │   │   ├── stats/       # Metric aggregation and reporting
│       │   │   ├── auth/        # JWT auth and guest rate guards
│       │   │   └── file-parser/ # Stream extraction (.txt, .docx)
│       │   └── common/          # Filters, interceptors, validation pipes