# MediVault AI
Next.js 14 (App Router) + Prisma (SQLite) + JWT cookie auth.

    cp .env.example .env      # set AUTH_SECRET and DOCTOR_INVITE_CODE
    npm install
    npx prisma db push
    npm run dev

Doctors sign up with DOCTOR_INVITE_CODE. For production: set provider = "postgresql" in prisma/schema.prisma,
set DATABASE_URL, AUTH_SECRET and NEXT_PUBLIC_BASE_URL, serve over HTTPS (Vercel + Neon works well).

## Documentation
- [Technology Stack & Languages](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/TECH_STACK.md)
- [Security Checklist & Mitigations](file:///c:/Users/Himanshu%20Sonkar/Downloads/medivault/medivault/SECURITY.md)

