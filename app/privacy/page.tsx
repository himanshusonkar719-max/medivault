import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/auth";

export const metadata = {
  title: "Privacy Policy & DPDP/GDPR Compliance — MediVault AI",
  description: "How MediVault AI protects your emergency medical records, respects DPDP Act 2023 and GDPR, and maintains strict audit logging.",
};

export default async function PrivacyPage() {
  const user = await getUser();

  return (
    <div className="container animate-entrance">
      <Navbar user={user} />

      <header style={{ marginBottom: "32px" }}>
        <span className="badge">Compliance & Data Protection</span>
        <h1 style={{ marginTop: "12px" }}>Privacy Policy & Data Rights</h1>
        <p className="lead">
          MediVault AI is built on a zero-tracking, privacy-first architecture aligned with India's Digital Personal Data Protection (DPDP) Act 2023 and the General Data Protection Regulation (GDPR).
        </p>
      </header>

      <section className="card">
        <h2>1. Architecture & Tiered Privacy</h2>
        <p>
          We employ a strict two-tier access architecture to balance emergency lifesaving needs with data privacy:
        </p>
        <ul style={{ paddingLeft: "20px", color: "var(--ink-muted)", marginBottom: "14px" }}>
          <li>
            <strong>Tier 1 — Public Emergency Triage (Unauthenticated):</strong> Limited strictly to essential data needed by first responders (Blood Group, Life-Threatening Allergies, and Emergency Contact Phone).
          </li>
          <li style={{ marginTop: "8px" }}>
            <strong>Tier 2 — Encrypted Clinical Record (Physician Authenticated):</strong> Chronic conditions, active prescriptions, and detailed dosages are restricted strictly to verified healthcare professionals.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>2. Immutable Doctor Access Audit Trail</h2>
        <p>
          Under medical data governance standards, whenever a physician accesses your full clinical record, the system automatically creates an immutable audit entry recording the physician's verified email and UTC timestamp. You can review this real-time audit log directly from your patient dashboard.
        </p>
      </section>

      <section className="card">
        <h2>3. Your Rights Under DPDP Act 2023 & GDPR</h2>
        <p>You maintain absolute ownership and control over your personal health information:</p>
        <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
          <div style={{ background: "var(--bg)", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <strong>Right to Access & Portability:</strong> You can download a complete machine-readable copy (JSON) of your health profile, medicines, and access logs at any time from your dashboard.
          </div>
          <div style={{ background: "var(--bg)", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <strong>Right to Rectification:</strong> You can edit and update your vitals, emergency contacts, or medications instantly.
          </div>
          <div style={{ background: "var(--bg)", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <strong>Right to Erasure ("Right to be Forgotten"):</strong> You have the right to permanently purge your account, medical profile, active medications, and logs with one click.
          </div>
        </div>
      </section>

      <section className="card">
        <h2>4. Zero Third-Party Trackers & Cookie Policy</h2>
        <p>
          MediVault AI does not use Google Analytics, advertising trackers, tracking pixels, or third-party cookies. We only set a single secure, encrypted, HTTP-only session cookie (<code>s</code>) necessary for authentication.
        </p>
      </section>

      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <Link href="/" className="btn btn-secondary btn-sm">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
