"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import Leaflet map with no SSR
const Map = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Memuat Peta...</p>
      </div>
    </div>
  )
});

interface OfficeLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

export default function OfficeSettingsMap() {
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await fetch("/api/settings/office");
      const data = await res.json();
      if (data.offices) {
        setOffices(data.offices);
      }
    } catch (error) {
      console.error("Failed to fetch offices", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffice = async (office: Partial<OfficeLocation>) => {
    try {
      const res = await fetch("/api/settings/office", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(office)
      });
      const data = await res.json();
      if (data.success) {
        await fetchOffices(); // Refresh
      } else {
        alert(data.error || "Gagal menambah lokasi");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  const handleDeleteOffice = async (id: string) => {
    if (!confirm("Hapus lokasi kantor ini?")) return;
    try {
      const res = await fetch(`/api/settings/office?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        await fetchOffices();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateOffice = async (office: OfficeLocation) => {
    try {
      const res = await fetch("/api/settings/office", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(office)
      });
      const data = await res.json();
      if (data.success) {
        await fetchOffices();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-800">Pengaturan Lokasi Kantor</h2>
        <p className="text-sm text-slate-500">
          Klik pada peta untuk menetapkan lokasi kantor baru dan atur radius absensi yang diizinkan.
        </p>
      </div>

      <Map 
        offices={offices} 
        onAddOffice={handleAddOffice} 
        onDeleteOffice={handleDeleteOffice}
        onUpdateOffice={handleUpdateOffice}
      />
      
      {/* Office List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {offices.map((office) => (
          <div key={office.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
            <h3 className="font-semibold text-slate-800">{office.name}</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Radius: {office.radius}m • Lat: {office.lat.toFixed(4)} • Lng: {office.lng.toFixed(4)}
            </p>
            <div className="mt-auto flex justify-end">
              <button 
                onClick={() => handleDeleteOffice(office.id)}
                className="text-xs font-medium text-red-600 hover:text-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {offices.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            <p className="text-sm text-slate-500">Belum ada lokasi kantor yang diatur.</p>
          </div>
        )}
      </div>
    </div>
  );
}
