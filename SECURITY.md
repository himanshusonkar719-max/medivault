# MediVault Pre-Launch Security & Architecture Checklist

This document details the security mitigations, architectural boundaries, and operational checklist implemented across MediVault AI to prevent common vulnerabilities seen in AI-assisted applications.

---

## 1. Secrets & Environment Variables
- [x] **No Secrets in Client Bundles**: Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- [x] **Production Secret Guard**: `lib/auth.ts` verifies that `AUTH_SECRET` is defined and not set to default dev placeholders in production.
- [x] **Git Hygiene**: `.env` is listed in `.gitignore` so personal keys and production database credentials never leak to public repositories.

---

## 2. Authentication & Authorization (BOLA / IDOR Defense)
- [x] **Secure Cookies**: JWT session cookies are configured with `httpOnly: true`, `sameSite: "lax"`, and `secure: true` in production.
- [x] **Strict Object-Level Ownership**: All update and delete actions explicitly scope queries to the authenticated user's ID:
  ```ts
  // Example from app/actions.ts:
  await db.medicine.deleteMany({
    where: { id: medicineId, profileId: profile.id }
  });
  ```
  Users cannot view or delete another patient's medical records by manipulating request IDs.
- [x] **Tiered Access Model**:
  - **Tier 1 (Public Triage)**: Only blood type, critical allergies, and emergency phone number are visible via QR token.
  - **Tier 2 (Clinical Vault)**: Chronic conditions and active prescriptions require a verified physician session (`role: "DOCTOR"`).

---

## 3. Input Validation & Sanitization
- [x] **XSS & Injection Protection**: Inputs are sanitized (`lib/validation.ts`) to strip HTML tags and control characters before entering the database.
- [x] **Length Bounding (DoS Defense)**: All text fields enforce hard limits (names &le; 100 chars, allergies &le; 500 chars, conditions &le; 1000 chars) to prevent storage and memory exhaustion attacks.
- [x] **Blood Group Whitelist**: Enforces strict enum validation (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).

---

## 4. Rate Limiting & Bot Defense
- [x] **Sliding-Window Rate Limiter**: `lib/ratelimit.ts` protects sensitive authentication actions:
  - **Sign Up**: Max 4 attempts per 10 minutes per IP.
  - **Sign In**: Max 5 attempts per 5 minutes per IP + email.
- [x] **Production Recommendation**: When scaling across multiple serverless nodes, back the rate limiter with Redis/Upstash using `@upstash/ratelimit`.

---

## 5. HTTP Security Headers ([next.config.mjs](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/next.config.mjs))
- [x] `Content-Security-Policy`: Restricts unauthorized scripts, objects, and framing.
- [x] `X-Frame-Options: DENY`: Defends against clickjacking.
- [x] `X-Content-Type-Options: nosniff`: Prevents MIME-confusion attacks.
- [x] `Referrer-Policy: strict-origin-when-cross-origin`: Stops sensitive token leakage in referrer headers.
- [x] `Permissions-Policy`: Disables camera, microphone, and geolocation access unless explicitly needed.
- [x] `poweredByHeader: false`: Removes the `X-Powered-By: Next.js` fingerprint.

---

## 6. Compliance (DPDP Act 2023 & GDPR)
- [x] **Right to Data Portability**: Patients can download a full JSON export of their medical record, medications, and audit logs.
- [x] **Right to Erasure ("Right to be Forgotten")**: Patients can permanently delete their account and associated health data with one click.
- [x] **Physician Audit Trail**: Every access by a medical professional generates an immutable log entry with timestamp and physician email.
- [x] **Zero Third-Party Trackers**: No analytics or advertising pixels are used.

---

## 7. Operational Monitoring Recommendations
1. **Error Tracking**: Install Sentry (`npx @sentry/wizard@latest -i nextjs`) to capture runtime exceptions before patients notice them.
2. **Database Backups**: When moving from SQLite to PostgreSQL (e.g. Neon or Supabase), enable point-in-time recovery (PITR).
3. **Password Resets & Email Verification**: Add transactional email delivery via Resend or Postmark with timed reset tokens.