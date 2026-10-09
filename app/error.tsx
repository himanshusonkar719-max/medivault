"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured:", error);
  }, [error]);

  return (
    <div
      className="container animate-entrance"
      style={{
        textAlign: "center",
        paddingTop: "80px",
        maxWidth: "520px",
      }}
    >
      <div className="badge badge-emergency" style={{ marginBottom: "16px" }}>
        System Error
      </div>
      <h1>Something went wrong</h1>
      <p className="lead">
        An unexpected error occurred while processing this health record.
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
        <button type="button" onClick={() => reset()} className="btn">
          Try Again
        </button>
        <Link href="/" className="btn btn-secondary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
