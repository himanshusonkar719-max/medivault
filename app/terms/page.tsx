import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getUser } from "@/lib/auth";

export const metadata = {
  title: "Terms of Service & Medical Disclaimer — MediVault AI",
  description: "Terms of use and auxiliary emergency medical service disclaimers for MediVault AI.",
};

export default async function TermsPage() {
  const user = await getUser();

  return (
    <div className="container animate-entrance">
      <Navbar user={user} />

      <header style={{ marginBottom: "32px" }}>
        <span className="badge">Legal Agreements</span>
        <h1 style={{ marginTop: "12px" }}>Terms of Service & Medical Disclaimer</h1>
        <p className="lead">
          Please review the operating terms and medical emergency disclaimer before utilizing the MediVault platform.
        </p>
      </header>

      <section className="card" style={{ borderColor: "var(--accent-border)" }}>
        <h2 style={{ color: "var(--accent)" }}>Emergency Medical Disclaimer</h2>
        <p>
          MediVault AI is an <strong>auxiliary emergency reference tool</strong> intended to expedite the retrieval of critical patient data by bystanders and first responders. It is <strong>NOT a replacement</strong> for calling local emergency dispatch services (such as 112 or 911), nor does it substitute for formal hospital electronic health record (EHR) verification.
        </p>
        <p style={{ margin: 0 }}>
          Users are responsible for ensuring that all entered medical conditions, allergies, and emergency phone numbers remain accurate and up-to-date.
        </p>
      </section>

      <section className="card">
        <h2>Doctor Verification & Professional Use</h2>
        <p>
          Access to Tier 2 clinical vaults requires valid healthcare provider authorization. Doctors accessing patient records acknowledge that every query is recorded with a permanent audit timestamp and doctor email accessible by the patient.
        </p>
      </section>

      <section className="card">
        <h2>Platform Availability & Data Integrity</h2>
        <p>
          While MediVault AI is built for high availability and offline redundancy (via printable physical cards and lock screen QR graphics), users are encouraged to maintain secondary physical medical ID tags when operating in areas with intermittent cellular connectivity.
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
