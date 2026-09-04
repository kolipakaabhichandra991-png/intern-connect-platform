"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import the scanner to avoid SSR issues with navigator.mediaDevices
const Scanner = dynamic(() => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-10 bg-slate-100">Initializing Camera...</div>
});

export default function QRScanner({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const scannedText = result[0].rawValue;
      if (scannedText) {
        setTimeout(() => {
          onClose();
          router.push(scannedText);
        }, 500);
      }
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    setErrorMsg(error?.message || "Failed to access camera. Please allow permissions.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-2xl p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 border-2 border-black rounded-full text-white font-bold text-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-red-600 z-10 flex items-center justify-center"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Scan ID Card</h2>
        
        {errorMsg ? (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-xl text-center font-bold">
            {errorMsg}
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border-2 border-black bg-black relative">
            <Scanner 
              onScan={handleScan}
              onError={handleError}
              formats={["qr_code"]}
              components={{ finder: true }}
            />
          </div>
        )}
        
        <p className="text-center text-slate-500 text-sm mt-4 font-mono">
          Align the QR code within the frame to instantly open their dossier.
        </p>
      </div>
    </div>
  );
}
