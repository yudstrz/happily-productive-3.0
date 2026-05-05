"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import Modal from "@/components/ui/Modal";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { useHP } from "@/lib/HPContext";
import HPGlyph from "@/components/ui/HPGlyph";

interface AttendanceScannerModalProps {
  onClose: () => void;
}

export default function AttendanceScannerModal({ onClose }: AttendanceScannerModalProps) {
  const { user, awardXP } = useHP();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Get location immediately
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Location error:", err)
      );
    }
  }, []);

  const startScanner = () => {
    setStatus('scanning');
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;
    
    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        handleCheckIn(decodedText);
        stopScanner();
      },
      () => {} // silent on failure
    ).catch(err => {
      console.error(err);
      setStatus('idle');
    });
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('verifying');
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        handleCheckIn(decodedText);
      })
      .catch(err => {
        setStatus('error');
        setErrorMsg("Tidak dapat menemukan QR Code di gambar ini.");
      });
  };

  const handleCheckIn = async (token: string) => {
    setStatus('verifying');
    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          token,
          lat: location?.lat,
          lng: location?.lng,
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        awardXP('priority_complete', 'Check-in kantor tepat waktu! 🏢'); // Reuse action for reward
        setTimeout(onClose, 2000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || "Gagal check-in");
      }
    } catch (e) {
      setStatus('error');
      setErrorMsg("Koneksi bermasalah.");
    }
  };

  return (
    <Modal onClose={onClose} title="Attendance Check-in">
      <div style={{ padding: '10px 0' }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <div style={{ ...HP_TEXT.h, fontSize: 18 }}>Berhasil Check-in!</div>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 800, marginTop: 8 }}>+50 XP Awarded 🎁</div>
          </div>
        ) : (
          <>
            <div style={{ 
              width: '100%', aspectRatio: '1/1', background: '#f8f8f8', 
              borderRadius: 24, overflow: 'hidden', position: 'relative',
              border: `2px dashed ${HP_TOKENS.line}`
            }}>
              <div id="reader" style={{ width: '100%', height: '100%' }}></div>
              
              {status === 'idle' && (
                <div style={{ 
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 20
                }}>
                  <HPGlyph name="target" size={48} color={HP_TOKENS.line} />
                  <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute }}>
                    Pilih metode absen di bawah ini
                  </div>
                </div>
              )}

              {status === 'verifying' && (
                <div style={{ 
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.8)'
                }}>
                  <div style={{ ...HP_TEXT.h, fontSize: 14 }}>Memverifikasi...</div>
                </div>
              )}
            </div>

            {status === 'error' && (
              <div style={{ 
                marginTop: 16, padding: 12, borderRadius: 12, background: HP_TOKENS.coralSoft, 
                color: HP_TOKENS.coral, fontSize: 13, fontWeight: 700, textAlign: 'center'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {status === 'idle' ? (
                <>
                  <button onClick={startScanner} style={{
                    width: '100%', padding: '16px', borderRadius: 99,
                    background: HP_TOKENS.blue, color: '#fff', border: 'none',
                    fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                  }} className="hp-tap">
                    <HPGlyph name="target" size={18} color="#fff" />
                    Scan QR Kantor
                  </button>
                  
                  <div style={{ position: 'relative', height: 48 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
                    />
                    <button style={{
                      width: '100%', padding: '16px', borderRadius: 99,
                      background: 'transparent', color: HP_TOKENS.blue, 
                      border: `1.5px solid ${HP_TOKENS.blue}`,
                      fontFamily: HP_FONT, fontWeight: 800, fontSize: 15,
                    }}>
                      Upload Gambar QR
                    </button>
                  </div>
                </>
              ) : (
                <button onClick={() => setStatus('idle')} style={{
                  width: '100%', padding: '16px', borderRadius: 99,
                  background: HP_TOKENS.lineSoft, color: HP_TOKENS.ink, border: 'none',
                  fontFamily: HP_FONT, fontWeight: 800, fontSize: 15,
                }}>
                  Batal
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
