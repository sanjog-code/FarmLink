"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const farmIcon = L.divIcon({
  className: "farm-leaflet-icon",
  html: '<div style="width:28px;height:28px;background:#16a34a;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.35);position:relative"><div style="width:8px;height:8px;background:#fff;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"></div></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface FarmMapProps {
  latitude: number;
  longitude: number;
  label?: string;
}

export function FarmMap({ latitude, longitude, label }: FarmMapProps) {
  const position: [number, number] = [latitude, longitude];
  return (
    <div className="h-64 rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={farmIcon}>
          <Popup className="farm-popup">{label || "Farm location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}