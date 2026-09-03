"use client";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  internId: string;
  name: string;
}

export default function QRCodeGenerator({ internId, name }: QRCodeProps) {
  // Generates the absolute URL to the scanned profile page
  // Fallback to localhost if NEXT_PUBLIC_BASE_URL is not set
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const profileUrl = `${baseUrl}/${internId}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <QRCodeSVG 
        value={profileUrl} 
        size={160}
        bgColor={"#ffffff"}
        fgColor={"#050510"} // Dark slate for better scanning
        level={"H"} // High error correction
      />
    </div>
  );
}
