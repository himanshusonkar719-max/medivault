"use client";

import { useState } from "react";

interface QRCardActionsProps {
  qrDataUrl: string;
  publicUrl: string;
}

export default function QRCardActions({ qrDataUrl, publicUrl }: QRCardActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "medivault-emergency-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-actions no-print">
      <button
        type="button"
        onClick={handleCopy}
        className="btn btn-secondary btn-sm"
        aria-label="Copy public emergency link"
      >
        {copied ? "Copied Link!" : "Copy Link"}
      </button>

      <button
        type="button"
        onClick={handleDownload}
        className="btn btn-secondary btn-sm"
        aria-label="Download QR code image"
      >
        Download QR
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="btn btn-secondary btn-sm"
        aria-label="Print emergency card"
      >
        Print Card
      </button>

      <a
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm"
      >
        Test Scan View
      </a>
    </div>
  );
}
