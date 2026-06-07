import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Doctor } from '../../../types/models/Evaluation';

// Fix Leaflet marker icons in Vite (image assets not bundled by default)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ILE_DE_FRANCE: [number, number] = [48.8566, 2.3522];

function createDoctorIcon(index: number, selected: boolean) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:28px;height:28px;border-radius:50%;
        background:${selected ? '#DC2626' : '#1E40AF'};
        border:2.5px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
        color:white;font-size:11px;font-weight:900;
      ">${index + 1}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(30,64,175,0.2);
          animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        "></div>
        <div style="
          position:absolute;inset:4px;border-radius:50%;
          background:#1E40AF;border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>
      </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// Flies to area center when a new search loads
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  const prev = useRef<string>('');
  useEffect(() => {
    const key = center.join(',');
    if (key !== prev.current) {
      prev.current = key;
      map.flyTo(center, 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

// Flies to the selected doctor's position
function FlyToSelected({ doctor }: { doctor: Doctor | null }) {
  const map = useMap();
  useEffect(() => {
    if (doctor?.lat != null && doctor?.lng != null) {
      map.flyTo([doctor.lat, doctor.lng], 16, { duration: 0.8 });
    }
  }, [doctor, map]);
  return null;
}

interface DoctorMapProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  userCoords: { lat: number; lng: number } | null;
  onSelectDoctor: (doc: Doctor) => void;
}

export default function DoctorMap({ doctors, selectedDoctor, userCoords, onSelectDoctor }: DoctorMapProps) {
  const validDoctors = doctors.filter(d => d.lat != null && d.lng != null);

  const center: [number, number] = (() => {
    if (userCoords) return [userCoords.lat, userCoords.lng];
    if (validDoctors.length > 0) {
      const avgLat = validDoctors.reduce((s, d) => s + d.lat!, 0) / validDoctors.length;
      const avgLng = validDoctors.reduce((s, d) => s + d.lng!, 0) / validDoctors.length;
      return [avgLat, avgLng];
    }
    return ILE_DE_FRANCE;
  })();

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap center={center} />
      <FlyToSelected doctor={selectedDoctor} />

      {/* User position */}
      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={createUserIcon()}>
          <Popup>
            <span style={{ fontWeight: 700 }}>Votre position</span>
          </Popup>
        </Marker>
      )}

      {/* Doctor markers */}
      {validDoctors.map((doc, idx) => (
        <Marker
          key={idx}
          position={[doc.lat!, doc.lng!]}
          icon={createDoctorIcon(idx, selectedDoctor?.name === doc.name)}
          eventHandlers={{ click: () => onSelectDoctor(doc) }}
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <p style={{ fontWeight: 800, marginBottom: 2 }}>{doc.name}</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{doc.address}</p>
              {doc.website && (
                <a
                  href={doc.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: '#1E40AF', fontWeight: 700 }}
                >
                  Voir le site →
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
