import Link from "next/link";
import { getUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function Home({
  searchParams,
}: {
  searchParams?: { deleted?: string };
}) {
  const user = await getUser();

  return (
    <div className="container animate-entrance">
      <Navbar user={user} />

      {searchParams?.deleted && (
        <div className="alert alert-warning animate-entrance" role="alert">
          Your MediVault account and all associated health records have been permanently deleted in accordance with data erasure rights.
        </div>
      )}

      <header style={{ marginBottom: "48px" }}>
        <div style={{ display: "inline-block", marginBottom: "16px" }}>
          <span className="badge badge-emergency">Emergency Response Ready</span>
        </div>
        <h1>
          When seconds count, your medical history is one scan away.
        </h1>
        <p className="lead" style={{ maxWidth: "620px" }}>
          Store your blood group, life-threatening allergies, and emergency contacts.
          Generate a high-contrast QR code for your wallet or lock screen. Verified doctors unlock your full clinical record with audited access.
        </p>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
          {user?.role === "DOCTOR" ? (
            <div className="card" style={{ margin: 0, padding: "14px 20px" }}>
              <span style={{ fontWeight: 600 }}>Doctor Mode Active</span>
              <p style={{ margin: 0, fontSize: "0.85rem" }}>
                Scan any patient QR code to access their comprehensive medical history and active medications.
              </p>
            </div>
          ) : (
            <>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="btn btn-lg"
              >
                {user ? "Open My Dashboard" : "Create Your Emergency ID"}
              </Link>
              {!user && (
                <Link href="/login" className="btn btn-secondary btn-lg">
                  Doctor Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      {/* Simulated Live Triage Card */}
      <section className="card" style={{ marginBottom: "40px" }} aria-label="Interactive Triage Preview">
        <div className="card-header">
          <h2>How First Responders See It</h2>
          <span className="badge">Triage Preview</span>
        </div>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="blood-badge" aria-label="Sample Blood Group">
            O+
            <span className="blood-label">Rh Pos</span>
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <h3 style={{ margin: "0 0 4px" }}>Critical Allergies: Penicillin & Sulfa</h3>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              Emergency Contact: <strong>Sarah Chen (Spouse)</strong> &bull; +1 (555) 234-5678
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--ink-faint)" }}>
              No passcodes required for lifesaving basics. Verified physicians can unlock chronic conditions and drug schedules.
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="features-grid" aria-label="Key Features">
        <article className="feature-card">
          <div className="feature-title">1. Instant Bystander Access</div>
          <p className="feature-desc">
            Bystanders and EMTs scan your QR code with any standard phone camera. Vital blood group, severe allergies, and emergency contacts appear immediately.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-title">2. Audited Doctor Vault</div>
          <p className="feature-desc">
            Sensitive chronic conditions and complete medication schedules remain protected behind verified physician authentication with immutable access timestamps.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-title">3. Physical & Digital Ready</div>
          <p className="feature-desc">
            Print a credit card-sized emergency card for your wallet, download the high-res PNG for your lock screen, and receive browser medication schedule alerts.
          </p>
        </article>
      </section>

      <footer
        style={{
          marginTop: "60px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          fontSize: "0.85rem",
          color: "var(--ink-faint)",
        }}
      >
        <div>MediVault AI &bull; Emergency Medical Profile System</div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/privacy" style={{ color: "var(--ink-muted)", textDecoration: "none" }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: "var(--ink-muted)", textDecoration: "none" }}>
            Terms & Disclaimer
          </Link>
        </div>
      </footer>
    </div>
  );
}
