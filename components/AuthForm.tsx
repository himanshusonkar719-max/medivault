"use client";

import { useState } from "react";
import { login, signup } from "@/app/actions";

export default function AuthForm({ initialError }: { initialError?: string }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  return (
    <div className="card animate-entrance" style={{ maxWidth: "440px", margin: "0 auto" }}>
      {initialError && (
        <div className="alert alert-error" role="alert">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>{initialError}</div>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          background: "var(--bg)",
          borderRadius: "var(--radius-sm)",
          padding: "4px",
          marginBottom: "24px",
          border: "1px solid var(--border)",
        }}
      >
        <button
          type="button"
          onClick={() => setTab("login")}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: tab === "login" ? "var(--card)" : "transparent",
            color: tab === "login" ? "var(--ink)" : "var(--ink-muted)",
            border: 0,
            borderRadius: "6px",
            fontWeight: tab === "login" ? 600 : 500,
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: tab === "signup" ? "var(--card)" : "transparent",
            color: tab === "signup" ? "var(--ink)" : "var(--ink-muted)",
            border: 0,
            borderRadius: "6px",
            fontWeight: tab === "signup" ? 600 : 500,
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          Create Account
        </button>
      </div>

      {tab === "login" ? (
        <form action={login}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn" style={{ width: "100%", marginTop: "8px" }}>
            Sign In to MediVault
          </button>
        </form>
      ) : (
        <form action={signup}>
          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password (8+ characters)</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-role">Account Type</label>
            <select
              id="signup-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "PATIENT" | "DOCTOR")}
            >
              <option value="PATIENT">Patient (Emergency Medical Profile & QR)</option>
              <option value="DOCTOR">Verified Medical Professional</option>
            </select>
          </div>

          {role === "DOCTOR" && (
            <div className="form-group animate-entrance">
              <label htmlFor="signup-code">
                Doctor Verification Code <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                id="signup-code"
                name="code"
                type="text"
                placeholder="Enter invite code"
                required
              />
            </div>
          )}

          <button type="submit" className="btn" style={{ width: "100%", marginTop: "8px" }}>
            Create Account
          </button>
        </form>
      )}
    </div>
  );
}
