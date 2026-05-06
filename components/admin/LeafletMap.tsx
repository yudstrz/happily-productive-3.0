"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Plus, Trash2, Save, MapPin } from "lucide-react";

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
    <div className="relative w-full h-[500px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler setDraftLocation={setDraftLocation} />

        {offices.map((office) => (
          <div key={office.id}>
            <Marker position={[office.lat, office.lng]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold text-slate-800">{office.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">Radius: {office.radius}m</p>
                  <button
                    onClick={() => onDeleteOffice(office.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[office.lat, office.lng]} 
              radius={office.radius} 
              pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }} 
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
              pathOptions={{ fillColor: 'green', fillOpacity: 0.2, color: 'green', weight: 2 }} 
            />
          </div>
        )}
      </MapContainer>

      {/* Draft Configuration Panel */}
      {draftLocation && (
        <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-xl shadow-lg border border-slate-200 w-80">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Tambah Lokasi Kantor</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nama Kantor</label>
              <input 
                type="text" 
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="mis. Kantor Pusat"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Radius Absensi (meter)</label>
              <input 
                type="number" 
                value={draftRadius}
                onChange={(e) => setDraftRadius(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button 
                onClick={() => setDraftLocation(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveDraft}
                disabled={!draftName}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!draftLocation && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
          Klik pada peta untuk menambah lokasi
        </div>
      )}
    </div>
  );
}
