import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Emergency({
  params,
}: {
  params: { token: string };
}) {
  const profile = await db.profile.findUnique({
    where: { token: params.token },
    include: { medicines: { orderBy: { time: "asc" } } },
  });

  if (!profile) notFound();

  const user = await getUser();
  const isDoctor = user?.role === "DOCTOR";

  // If a verified doctor accesses this page, log the access
  if (isDoctor && user) {
    await db.accessLog.create({
      data: {
        profileId: profile.id,
        doctorEmail: user.email,
      },
    });
  }

  return (
    <div className="container animate-entrance" style={{ maxWidth: "720px" }}>
      {/* Top Banner */}
      <div className="emergency-header">
        <div className="emergency-header-title">
          Emergency Medical Profile
        </div>
        <div className="emergency-patient-name">
          {profile.name || "Emergency Patient"}
        </div>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--ink-muted)" }}>
          Official MediVault Emergency Triage Record
        </p>

        <div className="emergency-vitals-row">
          <div style={{ textAlign: "center" }}>
            <span className="blood-label">Blood Type</span>
            <div className="blood-badge" style={{ marginTop: "4px" }}>
              {profile.bloodGroup || "Unknown"}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Allergies (Highest priority for EMTs) */}
      <section className="card" style={{ borderColor: "var(--accent-border)" }}>
        <div className="card-header">
          <h2 style={{ color: "var(--accent)" }}>Life-Threatening Allergies</h2>
          <span className="badge badge-emergency">CRITICAL</span>
        </div>
        <div style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--ink)" }}>
          {profile.allergies ? (
            <p style={{ color: "var(--accent)", margin: 0, fontWeight: 700 }}>
              {profile.allergies}
            </p>
          ) : (
            <p style={{ margin: 0, color: "var(--ink-muted)" }}>
              No critical allergies recorded.
            </p>
          )}
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="card">
        <div className="card-header">
          <h2>Emergency Contact</h2>
          <span className="badge">Primary Contact</span>
        </div>

        {profile.contactPhone ? (
          <div className="emergency-contact-box">
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {profile.contactName || "Designated Emergency Contact"}
              </div>
              <div style={{ color: "var(--ink-muted)", fontSize: "0.9rem" }}>
                Phone: {profile.contactPhone}
              </div>
            </div>

            <a
              href={`tel:${profile.contactPhone}`}
              className="btn btn-lg"
              style={{ minWidth: "160px" }}
            >
              Call {profile.contactPhone}
            </a>
          </div>
        ) : (
          <p className="mut">No emergency contact phone on file.</p>
        )}
      </section>

      {/* Doctor-Restricted Clinical Record */}
      {isDoctor ? (
        <section
          className="card"
          style={{
            border: "1px solid rgba(14, 165, 233, 0.4)",
            background: "rgba(14, 165, 233, 0.04)",
          }}
        >
          <div className="card-header">
            <div>
              <h2 style={{ color: "#38bdf8" }}>Physician Clinical Vault</h2>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--ink-faint)" }}>
                Logged verified access for: {user?.email}
              </p>
            </div>
            <span className="badge badge-doctor">Verified Doctor</span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3>Documented Chronic Conditions</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--ink)" }}>
              {profile.conditions || "No chronic medical conditions listed."}
            </p>
          </div>

          <div>
            <h3>Active Medication Regimen</h3>
            {profile.medicines.length > 0 ? (
              <div>
                {profile.medicines.map((m) => (
                  <div className="med-item" key={m.id}>
                    <div className="med-info">
                      <span className="med-time">{m.time}</span>
                      <div>
                        <span className="med-name">{m.name}</span>
                        {m.dose && <span className="med-dose"> ({m.dose})</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mut">No active medications registered.</p>
            )}
          </div>
        </section>
      ) : (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "24px",
            background: "var(--bg-subtle)",
          }}
        >
          <h3>Are you a treating physician or emergency doctor?</h3>
          <p style={{ fontSize: "0.9rem", maxWidth: "460px", margin: "0 auto 16px" }}>
            Sign in with a verified medical provider account to unlock the full clinical history, chronic conditions, and active prescriptions.
          </p>
          <Link href="/login" className="btn btn-secondary btn-sm">
            Doctor Sign In to Unlock Full EHR
          </Link>
        </div>
      )}

      {/* Return link */}
      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <Link href="/" className="btn btn-secondary btn-sm">
          Return to MediVault Home
        </Link>
      </div>
    </div>
  );
}
