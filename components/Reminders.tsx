"use client";

import { useEffect, useState } from "react";

type Medicine = {
  id: string;
  name: string;
  dose: string;
  time: string;
};

export default function Reminders({ meds }: { meds: Medicine[] }) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setPermission("unsupported");
    }
  }, []);

  useEffect(() => {
    if (permission !== "granted" || meds.length === 0) return;

    let lastCheckedMinute = "";
    const timer = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${currentHours}:${currentMinutes}`;

      if (currentTime === lastCheckedMinute) return;
      lastCheckedMinute = currentTime;

      const dueMeds = meds.filter((m) => m.time === currentTime);
      dueMeds.forEach((m) => {
        new Notification("MediVault Dose Reminder", {
          body: `It's time for ${m.name} (${m.dose || "scheduled dose"})`,
          icon: "/favicon.ico",
        });
      });
    }, 15000);

    return () => clearInterval(timer);
  }, [permission, meds]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification("MediVault Test Alert", {
        body: "Your medicine reminder alerts are working properly!",
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  if (permission === "unsupported") {
    return (
      <p className="mut" style={{ fontSize: "0.85rem" }}>
        Browser push notifications are not supported on this device.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
          Medicine Schedule Alerts
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--ink-muted)" }}>
          {permission === "granted"
            ? "Active: Browser alerts will chime when a dose is due while tab is open."
            : "Enable browser notifications to receive dose reminders."}
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {permission === "granted" ? (
          <button
            type="button"
            onClick={sendTestNotification}
            className="btn btn-secondary btn-sm"
          >
            {testSent ? "Alert Sent!" : "Test Alert"}
          </button>
        ) : (
          <button
            type="button"
            onClick={requestPermission}
            className="btn btn-sm"
          >
            Enable Reminders
          </button>
        )}
      </div>
    </div>
  );
}
