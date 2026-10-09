"use client";

import { useState } from "react";
import { exportHealthData, deleteAccount } from "@/app/actions";

export default function DataComplianceManager() {
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const data = await exportHealthData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medivault-health-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteAccount();
    } catch (err) {
      console.error("Delete account failed:", err);
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "14px 16px",
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
            Data Portability (DPDP / GDPR)
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-muted)" }}>
            Download an encrypted, machine-readable JSON copy of your entire health profile, medicines, and doctor access logs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="btn btn-secondary btn-sm"
        >
          {exporting ? "Generating JSON..." : "Download Health Data"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "14px 16px",
          background: "rgba(225, 29, 72, 0.04)",
          border: "1px solid var(--accent-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--accent)" }}>
            Right to be Forgotten
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-muted)" }}>
            Permanently delete your profile, prescriptions, QR tokens, and access logs. This action cannot be undone.
          </p>
        </div>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="btn btn-danger btn-sm"
          >
            Delete Account
          </button>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>
              Are you sure?
            </span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-sm"
              style={{ background: "var(--accent)" }}
            >
              {deleting ? "Deleting..." : "Confirm & Delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
