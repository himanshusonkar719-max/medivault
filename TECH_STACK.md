# MediVault AI — Technology Stack & Architecture Details

This document contains a comprehensive breakdown of the programming languages, runtime environments, frameworks, libraries, database engines, security architecture, and tooling used across the **MediVault** application.

---

## 1. Programming & Markup Languages

| Language | Version / Specification | Usage & Scope |
| :--- | :--- | :--- |
| **TypeScript** | `v5.x` | Primary codebase language across the entire application (`.ts`, `.tsx`). Provides strict static typing, interfaces, and compile-time type safety for Server Actions, components, validation helpers, and database queries. Configured via [`tsconfig.json`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/tsconfig.json). |
| **JavaScript (ESM / Node.js)** | Modern ECMAScript (ES2022+) | Config files like [`next.config.mjs`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/next.config.mjs) and package scripts. Executed on the Node.js runtime. |
| **CSS3** | Modern Vanilla CSS | Styling is implemented in [`app/globals.css`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/app/globals.css) using CSS Custom Properties (CSS variables) for light/dark theming, flexbox/grid layouts, animations, transitions, and media queries without any third-party CSS utility frameworks. |
| **HTML5** | Modern Semantic HTML5 | Component markup generated via React JSX (`.tsx`). Semantic elements used include `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<input>`, and ARIA attributes for accessibility. |
| **Prisma Schema Language (PSL)** | Prisma v5 DSL | Declarative database modeling in [`prisma/schema.prisma`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/prisma/schema.prisma) defining database providers, generators, entities, fields, relations, and indexes. |
| **Markdown** | CommonMark / GFM | Project documentation ([`README.md`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/README.md), [`SECURITY.md`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/SECURITY.md), and [`TECH_STACK.md`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/TECH_STACK.md)). |
| **JSON** | Standard JSON | Manifests and configuration files ([`package.json`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/package.json), [`tsconfig.json`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/tsconfig.json)). |

---

## 2. Core Frameworks & Runtime

### Next.js 14 (`v14.2.15`)
- **App Router Architecture**: Utilizes React Server Components (RSC) by default for zero client bundle overhead on static/server-rendered views.
- **Server Actions**: Server-side mutations executed via `'use server'` in [`app/actions.ts`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/app/actions.ts) handling login, registration, medical updates, medicine deletion, and log queries.
- **Dynamic Routing**:
  - `/app/e/[token]/page.tsx`: Dynamic public emergency triage view accessed via QR code.
  - `/app/dashboard/page.tsx`: Protected dashboard for patients and doctors.
  - `/app/login/page.tsx`: Authentication portal.
- **Security Headers & Optimizations**: Configured in [`next.config.mjs`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/next.config.mjs) (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Permissions-Policy).

### React 18 (`v18.3.1`) & React DOM (`v18.3.1`)
- **Client Components**: Interactive micro-components denoted with `'use client'`, including:
  - [`components/ThemeToggle.tsx`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/components/ThemeToggle.tsx): Client-side dark/light theme switching.
  - [`components/Reminders.tsx`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/components/Reminders.tsx): Real-time medicine alerts using Web Speech API & Notifications.
  - [`components/QRCardActions.tsx`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/components/QRCardActions.tsx): QR code download and clipboard sharing.
  - [`components/DataComplianceManager.tsx`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/components/DataComplianceManager.tsx): GDPR/HIPAA-style data export and account purging.
  - [`components/AuthForm.tsx`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/components/AuthForm.tsx): Client-side form handling and submission feedback.

---

## 3. Database & ORM Layer

### Prisma ORM (`v5.20.0`)
- Type-safe query builder and database migration engine.
- Configured in [`prisma/schema.prisma`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/prisma/schema.prisma) and instantiated in [`lib/db.ts`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/lib/db.ts).

### Database Engine
- **Development**: **SQLite** (file-based database: `dev.db`, zero external dependencies).
- **Production-Ready**: Schema is configured to be switched to **PostgreSQL** (e.g., Neon, Supabase, AWS RDS) by changing `provider = "postgresql"` in `prisma/schema.prisma`.

### Data Models
1. **`User`**:
   - `id` (CUID String, Primary Key)
   - `email` (Unique String)
   - `hash` (Bcrypt password hash)
   - `role` (`PATIENT` | `DOCTOR`)
   - `profile` (1-to-1 relation with `Profile`)
2. **`Profile`**:
   - `id`, `userId` (Foreign key to `User`, Cascade delete)
   - `token` (Unique CUID for public QR access)
   - `name`, `bloodGroup`, `allergies`, `conditions`, `contactName`, `contactPhone`
   - `medicines` (1-to-Many relation with `Medicine`)
   - `logs` (1-to-Many relation with `AccessLog`)
3. **`Medicine`**:
   - `id`, `profileId`, `name`, `dose`, `time`
4. **`AccessLog`**:
   - `id`, `profileId`, `doctorEmail`, `at` (DateTime audit trail)

---

## 4. Authentication, Cryptography & Security

| Tool / Package | Version | Purpose & Implementation |
| :--- | :--- | :--- |
| **`jose`** | `^5.9.0` | Stateless JSON Web Token (JWT) signing and verification using `SignJWT` and `jwtVerify` with HMAC-SHA256 in [`lib/auth.ts`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/lib/auth.ts). |
| **`bcryptjs`** | `^2.4.3` | One-way Blowfish-based password hashing (`hash` & `compare`) with 10 salt rounds. |
| **Cookie Storage** | Built-in Next.js | JWTs stored in `httpOnly`, `sameSite: "lax"`, and `secure: true` (in production) cookies named `token`. |
| **Rate Limiter** | Custom in-memory | Sliding-window IP/identifier rate limiter in [`lib/ratelimit.ts`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/lib/ratelimit.ts) (Sign-up: 4/10m, Sign-in: 5/5m). |
| **Input Sanitizer** | Custom regex | HTML tag stripping, input bounding, and blood group validation in [`lib/validation.ts`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/lib/validation.ts). |

---

## 5. Third-Party Libraries & Utility Packages

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **`qrcode`** | `^1.5.4` | Server-side QR code generation (`QRCode.toDataURL`) for emergency access cards. |
| **`@prisma/client`** | `^5.20.0` | Generated client for type-safe database queries. |
| **`@types/node`** | `^20` | TypeScript type declarations for Node.js runtime. |
| **`@types/react`** | `^18` | TypeScript definitions for React. |
| **`@types/qrcode`** | `^1.5.5` | TypeScript definitions for `qrcode`. |
| **`@types/bcryptjs`** | `^2.4.6` | TypeScript definitions for `bcryptjs`. |

---

## 6. Web & Browser APIs Utilized

- **Web Speech API (`SpeechSynthesis`)**: Provides voice alarms and audible speech alerts for medication schedules in [`components/Reminders.tsx`](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/components/Reminders.tsx).
- **Web Audio API (`AudioContext`)**: Generates custom synthesized sine-wave reminder tones without external sound files.
- **Web Notifications API (`Notification`)**: Triggers desktop notification reminders for scheduled doses.
- **Clipboard API (`navigator.clipboard`)**: One-click copying of public emergency access URLs.
- **Local Storage API (`localStorage`)**: Persists UI theme preference (`light` / `dark`).

---

## 7. Directory & Architecture Map

```
medivault/
├── app/                              # Next.js 14 App Router
│   ├── actions.ts                    # Server Actions (Auth, Updates, Audit Logs, Data Purge)
│   ├── globals.css                   # Global Vanilla CSS & Design Tokens
│   ├── layout.tsx                    # Root HTML layout with Navbar & Providers
│   ├── page.tsx                      # Landing / Marketing page
│   ├── error.tsx                     # Global error boundary component
│   ├── not-found.tsx                 # 404 Not Found page
│   ├── dashboard/                    # Patient / Doctor authenticated dashboard
│   ├── e/[token]/                    # Dynamic public QR emergency view (Tiered access)
│   ├── login/                        # Sign-in & Sign-up page
│   ├── privacy/                      # Privacy policy page
│   └── terms/                        # Terms of service page
├── components/                       # Reusable React UI components
│   ├── AuthForm.tsx                  # Interactive client auth form
│   ├── DataComplianceManager.tsx     # GDPR/HIPAA data export & erasure manager
│   ├── Navbar.tsx                    # Responsive navigation bar
│   ├── QRCardActions.tsx             # QR download & copy links
│   ├── Reminders.tsx                 # Audio & voice medicine reminders
│   └── ThemeToggle.tsx               # Dark/Light theme toggler
├── lib/                              # Server and utility helpers
│   ├── auth.ts                       # JWT issuance, verification & cookie management
│   ├── db.ts                         # Singleton Prisma client instance
│   ├── ratelimit.ts                  # Sliding-window rate limiting engine
│   └── validation.ts                 # XSS sanitization & input schemas
├── prisma/
│   └── schema.prisma                 # Database models & relationships
├── .env.example                      # Environment variable templates
├── next.config.mjs                   # Next.js runtime & security header configs
├── package.json                      # Dependency manifests & NPM scripts
├── SECURITY.md                       # Security & architectural mitigations
├── TECH_STACK.md                     # This tech stack & language guide
└── tsconfig.json                     # TypeScript compiler settings
```

---

## 8. Environment Variables

| Variable | Required in Prod | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | Database connection string (e.g. `file:./dev.db` or `postgresql://...`). |
| `AUTH_SECRET` | Yes | Strong secret key (min 32 characters) used to sign session JWTs. |
| `DOCTOR_INVITE_CODE` | Yes | Verification passphrase required during doctor account creation. |
| `NEXT_PUBLIC_BASE_URL`| Optional (Prod) | Base domain URL used to format emergency QR links (defaults to current origin). |
