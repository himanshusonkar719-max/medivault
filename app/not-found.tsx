import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="container animate-entrance"
      style={{
        textAlign: "center",
        paddingTop: "80px",
        maxWidth: "520px",
      }}
    >
      <div className="blood-badge" style={{ marginBottom: "20px" }}>
        404
      </div>
      <h1>Record Not Found</h1>
      <p className="lead">
        The requested medical profile or page does not exist or may have been revoked by the patient.
      </p>

      <div style={{ marginTop: "24px" }}>
        <Link href="/" className="btn">
          Return to MediVault Home
        </Link>
      </div>
    </div>
  );
}
