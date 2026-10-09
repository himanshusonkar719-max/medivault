import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { saveProfile, addMedicine, deleteMedicine } from "../actions";
import Reminders from "@/components/Reminders";
import Navbar from "@/components/Navbar";
import QRCardActions from "@/components/QRCardActions";
import DataComplianceManager from "@/components/DataComplianceManager";

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: { e?: string };
}) {
  const user = await getUser();
  if (!user || user.role !== "PATIENT") {
    redirect("/login");
  }

  const profile = await db.profile.findUniqueOrThrow({
    where: { userId: user.id },
    include: {
      medicines: { orderBy: { time: "asc" } },
      logs: { orderBy: { at: "desc" }, take: 8 },
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const publicUrl = `${baseUrl}/e/${profile.token}`;
  const qrDataUrl = await QRCode.toDataURL(publicUrl, {
    margin: 1,
    width: 320,
    color: {
      dark: "#0c1015",
      light: "#ffffff",
    },
  });

  return (
    <div className="container animate-entrance">
      <Navbar user={user} />

      {searchParams?.e && (
        <div className="alert alert-error" role="alert">
          {searchParams.e}
        </div>
      )}

      {/* Emergency QR Code & Card */}
      <section className="card" aria-label="Emergency QR Code">
        <div className="card-header">
          <h2>Your Emergency QR Code</h2>
          <span className="badge badge-emergency">Lifesaver Pass</span>
        </div>

        <div className="qr-wrapper">
          <div className="qr-image-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Emergency Profile QR Code"
              width={200}
              height={200}
              style={{ display: "block" }}
            />
          </div>

          <div className="qr-meta">
            <h3 style={{ marginBottom: "6px" }}>Scan to view vital emergency data</h3>
            <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
              Keep this QR code on your lock screen, inside your wallet, or on medical jewelry.
              First responders can scan it with any camera without needing an app.
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--ink-faint)", wordBreak: "break-all" }}>
              Public Link: <a href={publicUrl} target="_blank" rel="noopener noreferrer">{publicUrl}</a>
            </p>

            <QRCardActions qrDataUrl={qrDataUrl} publicUrl={publicUrl} />
          </div>
        </div>
      </section>

      {/* Printable Emergency ID Card for Wallet */}
      <section
        className="card"
        style={{
          border: "2px dashed var(--border)",
          background: "var(--bg-subtle)",
          padding: "20px",
        }}
        aria-label="Emergency Card Preview"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)" }}>
            Physical Medical Card Preview
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
            Wallet Card Size
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{profile.name || "Patient Name"}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginTop: "2px" }}>
              Blood Group: <strong>{profile.bloodGroup || "Not specified"}</strong>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>
              Allergies: <strong>{profile.allergies || "None declared"}</strong>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>
              Emergency Contact: <strong>{profile.contactName || "—"} ({profile.contactPhone || "—"})</strong>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="badge badge-emergency">MEDIVAULT ID</span>
          </div>
        </div>
      </section>

      {/* Medical Profile Edit Form */}
      <section className="card" aria-label="Medical Profile Settings">
        <div className="card-header">
          <h2>Medical Profile Details</h2>
          <span className="badge">Triage & EHR</span>
        </div>

        <form action={saveProfile}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Legal Name</label>
              <input
                id="name"
                name="name"
                defaultValue={profile.name}
                maxLength={100}
                placeholder="e.g. Johnathan Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                defaultValue={profile.bloodGroup}
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="allergies">
              Critical Allergies <span style={{ color: "var(--accent)" }}>(Life-Threatening / EMT Visible)</span>
            </label>
            <textarea
              id="allergies"
              name="allergies"
              defaultValue={profile.allergies}
              maxLength={500}
              placeholder="e.g. Severe Penicillin anaphylaxis, Peanuts, Latex"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="conditions">
              Chronic Medical Conditions <span style={{ color: "var(--ink-faint)" }}>(Encrypted &bull; Doctors Only)</span>
            </label>
            <textarea
              id="conditions"
              name="conditions"
              defaultValue={profile.conditions}
              maxLength={1000}
              placeholder="e.g. Type 1 Diabetes, Hypertension, Asthma, Cardiac Stent (2023)"
              rows={3}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contactName">Primary Emergency Contact Name</label>
              <input
                id="contactName"
                name="contactName"
                defaultValue={profile.contactName}
                maxLength={100}
                placeholder="e.g. Jane Doe (Spouse)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Emergency Contact Phone Number</label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                defaultValue={profile.contactPhone}
                maxLength={30}
                placeholder="e.g. +1 555-019-2834"
              />
            </div>
          </div>

          <button type="submit" className="btn">
            Save Medical Profile
          </button>
        </form>
      </section>

      {/* Active Medications & Schedule Reminders */}
      <section className="card" aria-label="Prescriptions and Medicines">
        <div className="card-header">
          <h2>Active Medications & Daily Doses</h2>
          <span className="badge">Schedule</span>
        </div>

        {profile.medicines.length > 0 ? (
          <div>
            {profile.medicines.map((med) => (
              <div className="med-item" key={med.id}>
                <div className="med-info">
                  <span className="med-time">{med.time}</span>
                  <div>
                    <span className="med-name">{med.name}</span>{" "}
                    {med.dose && <span className="med-dose">({med.dose})</span>}
                  </div>
                </div>

                <form action={deleteMedicine} style={{ margin: 0 }}>
                  <input type="hidden" name="id" value={med.id} />
                  <button
                    type="submit"
                    className="btn btn-danger btn-sm"
                    aria-label={`Remove medication ${med.name}`}
                  >
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="mut">
            No medications added yet. Add prescriptions to maintain your emergency medical regimen.
          </p>
        )}

        {/* Add Medication Form */}
        <form
          action={addMedicine}
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>
            Add Medication or Supplement
          </h3>
          <div className="form-grid">
            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label htmlFor="med-name">Medicine Name</label>
              <input
                id="med-name"
                name="name"
                maxLength={100}
                placeholder="e.g. Metformin / Lisinopril"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label htmlFor="med-dose">Dosage & Frequency</label>
              <input
                id="med-dose"
                name="dose"
                maxLength={100}
                placeholder="e.g. 500mg with breakfast"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="form-group" style={{ flex: "1", minWidth: "160px", marginBottom: 0 }}>
              <label htmlFor="med-time">Daily Scheduled Time</label>
              <input
                id="med-time"
                name="time"
                type="time"
                defaultValue="08:00"
              />
            </div>

            <button type="submit" className="btn btn-sm" style={{ height: "42px" }}>
              Add to Schedule
            </button>
          </div>
        </form>

        <div style={{ marginTop: "16px" }}>
          <Reminders meds={profile.medicines} />
        </div>
      </section>

      {/* Doctor Access Audit Log */}
      <section className="card" aria-label="Access Security Log">
        <div className="card-header">
          <h2>Clinical Access Audit Trail</h2>
          <span className="badge">Audit Trail</span>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "14px" }}>
          Every time a verified physician logs in to view your complete clinical history (conditions & medications), an immutable access log is recorded here.
        </p>

        {profile.logs.length > 0 ? (
          <div>
            {profile.logs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "0.85rem",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>{log.doctorEmail}</span>
                  <span className="badge badge-doctor" style={{ marginLeft: "8px" }}>
                    Verified Physician
                  </span>
                </div>
                <span style={{ color: "var(--ink-faint)" }}>
                  {new Date(log.at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mut" style={{ fontSize: "0.85rem" }}>
            No clinical lookups recorded yet. Your record has not been accessed by outside doctors.
          </p>
        )}
      </section>

      {/* Data Governance & DPDP/GDPR Compliance */}
      <section className="card" aria-label="Data Privacy and Erasure">
        <div className="card-header">
          <h2>Data Governance & Rights</h2>
          <span className="badge">DPDP / GDPR</span>
        </div>

        <DataComplianceManager />
      </section>
    </div>
  );
}
