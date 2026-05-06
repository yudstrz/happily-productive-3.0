"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface OfficeLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

interface MapProps {
  offices: OfficeLocation[];
  onAddOffice: (office: Partial<OfficeLocation>) => void;
  onDeleteOffice: (id: string) => void;
  onUpdateOffice: (office: OfficeLocation) => void;
}

function ClickHandler({ setDraftLocation }: { setDraftLocation: (loc: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setDraftLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LeafletMap({ offices, onAddOffice, onDeleteOffice, onUpdateOffice }: MapProps) {
  const [draftLocation, setDraftLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftRadius, setDraftRadius] = useState(100);

  // Focus on the first office, or a default location
  const center: [number, number] = offices.length > 0 ? [offices[0].lat, offices[0].lng] : [-6.2088, 106.8456]; // Default to Jakarta

  const handleSaveDraft = () => {
    if (!draftLocation || !draftName) return;
    onAddOffice({
      name: draftName,
      lat: draftLocation.lat,
      lng: draftLocation.lng,
      radius: draftRadius
    });
    setDraftLocation(null);
    setDraftName("");
    setDraftRadius(100);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#fff', borderRadius: 20, overflow: 'hidden', border: `1px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT }}>
      {/* Map Container Needs Explicit Height */}
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler setDraftLocation={setDraftLocation} />

        {offices.map((office) => (
          <div key={office.id}>
            <Marker position={[office.lat, office.lng]}>
              <Popup>
                <div style={{ padding: 4, fontFamily: HP_FONT }}>
                  <h3 style={{ ...HP_TEXT.h, fontSize: 14 }}>{office.name}</h3>
                  <p style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginBottom: 8 }}>Radius: {office.radius}m</p>
                  <button
                    onClick={() => onDeleteOffice(office.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
                      background: HP_TOKENS.coralSoft, color: HP_TOKENS.coral, borderRadius: 8,
                      border: 'none', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: HP_FONT
                    }}
                  >
                    <HPGlyph name="cross" size={12} color={HP_TOKENS.coral} /> Hapus
                  </button>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[office.lat, office.lng]} 
              radius={office.radius} 
              pathOptions={{ fillColor: HP_TOKENS.blue, fillOpacity: 0.1, color: HP_TOKENS.blue, weight: 1 }} 
            />
          </div>
        ))}

        {draftLocation && (
          <div>
            <Marker position={[draftLocation.lat, draftLocation.lng]}>
              <Popup>Titik Baru</Popup>
            </Marker>
            <Circle 
              center={[draftLocation.lat, draftLocation.lng]} 
              radius={draftRadius} 
              pathOptions={{ fillColor: HP_TOKENS.sage, fillOpacity: 0.2, color: HP_TOKENS.sage, weight: 2 }} 
            />
          </div>
        )}
      </MapContainer>

      {/* Draft Configuration Panel */}
      {draftLocation && (
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 1000,
          background: '#fff', padding: 16, borderRadius: 16, width: 300,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: `1px solid ${HP_TOKENS.line}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <HPGlyph name="target" size={18} color={HP_TOKENS.blue} />
            <h3 style={{ ...HP_TEXT.h, fontSize: 14 }}>Tambah Lokasi Kantor</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 4, display: 'block' }}>Nama Kantor</label>
              <input 
                type="text" 
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="mis. Kantor Pusat"
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: `1px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, outline: 'none' }}
              />
            </div>
            
            <div>
              <label style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 4, display: 'block' }}>Radius Absensi (meter)</label>
              <input 
                type="number" 
                value={draftRadius}
                onChange={(e) => setDraftRadius(parseInt(e.target.value) || 0)}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: `1px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button 
                onClick={() => setDraftLocation(null)}
                style={{ flex: 1, padding: '10px', background: HP_TOKENS.lineSoft, color: HP_TOKENS.ink, borderRadius: 10, border: 'none', fontFamily: HP_FONT, fontWeight: 800, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button 
                onClick={handleSaveDraft}
                disabled={!draftName}
                style={{ flex: 1, padding: '10px', background: HP_TOKENS.blue, color: '#fff', borderRadius: 10, border: 'none', fontFamily: HP_FONT, fontWeight: 800, cursor: 'pointer', opacity: draftName ? 1 : 0.5 }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!draftLocation && (
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 1000,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '8px 16px',
          borderRadius: 12, border: `1px solid ${HP_TOKENS.lineSoft}`,
          ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700
        }}>
          Klik pada peta untuk menambah lokasi
        </div>
      )}
    </div>
  );
}
