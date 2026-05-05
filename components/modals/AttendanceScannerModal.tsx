"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "@/components/ui/Modal";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { useHP } from "@/lib/HPContext";
import HPGlyph from "@/components/ui/HPGlyph";

interface AttendanceScannerModalProps {
  onClose: () => void;
}

export default function AttendanceScannerModal({ onClose }: AttendanceScannerModalProps) {
  const { user, awardXP } = useHP();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'error' | 'show_qr'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // QR Token state
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrExpiresAt, setQrExpiresAt] = useState<Date | null>(null);
  const [qrTimeLeft, setQrTimeLeft] = useState<string>("");
  const [qrLoading, setQrLoading] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoRefreshRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Get location immediately
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Location error:", err)
      );
    }
  }, []);

  // Fetch a new token from API
  const fetchQrToken = useCallback(async () => {
    setQrLoading(true);
    try {
      const res = await fetch("/api/attendance/token");
      const data = await res.json();
      if (data.token && data.expiresAt) {
        setQrToken(data.token);
        setQrExpiresAt(new Date(data.expiresAt));
        setErrorMsg("");
      } else {
        setErrorMsg("Gagal membuat QR token.");
      }
    } catch (e) {
      setErrorMsg("Koneksi bermasalah, gagal membuat QR.");
    } finally {
      setQrLoading(false);
    }
  }, []);

  // Countdown timer + auto-refresh
  useEffect(() => {
    // Clear previous timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoRefreshRef.current) clearTimeout(autoRefreshRef.current);

    if (status !== 'show_qr' || !qrExpiresAt) {
      setQrTimeLeft("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = qrExpiresAt.getTime() - now.getTime();
      
      if (diff <= 0) {
        setQrTimeLeft("Kadaluarsa");
        if (timerRef.current) clearInterval(timerRef.current);
        // Auto-refresh: fetch new token
        autoRefreshRef.current = setTimeout(() => {
          fetchQrToken();
        }, 500);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setQrTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    timerRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoRefreshRef.current) clearTimeout(autoRefreshRef.current);
    };
  }, [status, qrExpiresAt, fetchQrToken]);

  // When user clicks "Tampilkan QR Saya", fetch token
  const showMyQR = async () => {
    setStatus('show_qr');
    await fetchQrToken();
  };

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

  const downloadQR = () => {
    const canvas = document.getElementById("my-qr") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_Absen_${user?.name?.replace(/\s+/g, '_') || 'Karyawan'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Format expiry time for display
  const formatExpiryTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Determine countdown color
  const getCountdownColor = () => {
    if (!qrExpiresAt) return HP_TOKENS.inkMute;
    const diff = qrExpiresAt.getTime() - Date.now();
    if (diff <= 0) return HP_TOKENS.coral;
    if (diff <= 60000) return HP_TOKENS.coral; // < 1 min = red
    if (diff <= 120000) return HP_TOKENS.yellow; // < 2 min = yellow
    return HP_TOKENS.sage; // green
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

              {status === 'show_qr' && (
                <div style={{ 
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', background: '#fff', zIndex: 10
                }}>
                  {qrLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, border: `3px solid ${HP_TOKENS.line}`,
                        borderTopColor: HP_TOKENS.blue, borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                      <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute }}>Membuat QR Code...</div>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                  ) : qrToken ? (
                    <>
                      <QRCodeCanvas 
                        id="my-qr" 
                        value={qrToken} 
                        size={180} 
                        level={"H"} 
                        includeMargin={true}
                      />
                      {/* Expiry info below QR */}
                      <div style={{ 
                        marginTop: 8, display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', gap: 4, width: '100%', padding: '0 16px'
                      }}>
                        {/* Countdown badge */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px', borderRadius: 99,
                          background: qrTimeLeft === 'Kadaluarsa' ? HP_TOKENS.coralSoft : HP_TOKENS.blueSoft,
                          transition: 'background 0.3s ease'
                        }}>
                          <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: getCountdownColor(),
                            boxShadow: qrTimeLeft !== 'Kadaluarsa' ? `0 0 6px ${getCountdownColor()}` : 'none',
                            animation: qrTimeLeft === 'Kadaluarsa' ? 'none' : 'pulse-dot 2s ease-in-out infinite'
                          }} />
                          <span style={{ 
                            fontFamily: HP_FONT, fontWeight: 800, fontSize: 14,
                            color: getCountdownColor(),
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {qrTimeLeft === 'Kadaluarsa' ? '⟳ Memperbarui...' : qrTimeLeft}
                          </span>
                          <style>{`@keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
                        </div>
                        {/* Expiry detail */}
                        {qrExpiresAt && qrTimeLeft !== 'Kadaluarsa' && (
                          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontSize: 11, textAlign: 'center' }}>
                            Berlaku hingga {formatExpiryTime(qrExpiresAt)}  •  Auto-refresh saat habis
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ ...HP_TEXT.small, color: HP_TOKENS.coral }}>Gagal membuat QR Code</div>
                      <button onClick={fetchQrToken} style={{
                        padding: '8px 20px', borderRadius: 99,
                        background: HP_TOKENS.blue, color: '#fff', border: 'none',
                        fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer'
                      }}>
                        Coba Lagi
                      </button>
                    </div>
                  )}
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
                      fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer'
                    }}>
                      Upload Gambar QR
                    </button>
                  </div>
                  
                  <button onClick={showMyQR} style={{
                    width: '100%', padding: '16px', borderRadius: 99,
                    background: 'transparent', color: HP_TOKENS.inkFade, border: 'none',
                    fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                    textDecoration: 'underline'
                  }}>
                    Tampilkan QR Saya
                  </button>
                </>
              ) : status === 'show_qr' ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={downloadQR} style={{
                    flex: 1, padding: '14px', borderRadius: 99,
                    background: HP_TOKENS.sage, color: '#fff', border: 'none',
                    fontFamily: HP_FONT, fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: qrToken ? 1 : 0.5, pointerEvents: qrToken ? 'auto' : 'none'
                  }}>
                    <HPGlyph name="download" size={16} color="#fff" />
                    Download
                  </button>
                  <button onClick={() => { setStatus('idle'); setQrToken(null); setQrExpiresAt(null); }} style={{
                    flex: 1, padding: '14px', borderRadius: 99,
                    background: HP_TOKENS.lineSoft, color: HP_TOKENS.ink, border: 'none',
                    fontFamily: HP_FONT, fontWeight: 800, fontSize: 14, cursor: 'pointer'
                  }}>
                    Kembali
                  </button>
                </div>
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
