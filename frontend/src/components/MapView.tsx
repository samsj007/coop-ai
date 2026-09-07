import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WorkerProfile } from '../types';

interface MapViewProps {
  centerLat: number;
  centerLng: number;
  zoom?: number;
  workers?: WorkerProfile[];
  selectedWorkerId?: string;
  onWorkerSelect?: (worker: WorkerProfile) => void;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  centerLat,
  centerLng,
  zoom = 12,
  workers = [],
  selectedWorkerId,
  onWorkerSelect,
  height = '400px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], zoom);
    }

    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const customerIcon = L.divIcon({
      className: 'custom-customer-pin',
      html: `<div style="background-color: #4f46e5; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">📍</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const customerMarker = L.marker([centerLat, centerLng], { icon: customerIcon })
      .addTo(map)
      .bindPopup('<b>Service Location</b><br>Customer Address');
    markersRef.current.push(customerMarker);

    workers.forEach((worker) => {
      const isSelected = worker.worker_id === selectedWorkerId;
      const isApproved = worker.verification_status === 'APPROVED';

      const workerIcon = L.divIcon({
        className: 'custom-worker-pin',
        html: `<div style="background-color: ${
          isSelected ? '#059669' : isApproved ? '#2563eb' : '#d97706'
        }; color: white; border-radius: 20px; padding: 4px 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); white-space: nowrap;">
          ⚡ ${worker.name.split(' ')[0]} (${worker.rating}★)
        </div>`,
        iconSize: [100, 30],
        iconAnchor: [50, 15],
      });

      const workerMarker = L.marker([worker.latitude, worker.longitude], { icon: workerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px;">
            <strong style="font-size: 14px;">${worker.name}</strong><br/>
            <span style="color: #4b5563;">${worker.skills.join(', ')}</span><br/>
            <span style="color: #059669; font-weight: bold;">${worker.rating} ★ (${worker.completed_jobs} jobs)</span><br/>
            <span style="color: #2563eb;">📍 ${worker.city}, ${worker.state}</span>
          </div>
        `);

      workerMarker.on('click', () => {
        if (onWorkerSelect) onWorkerSelect(worker);
      });

      markersRef.current.push(workerMarker);
    });

  }, [centerLat, centerLng, zoom, workers, selectedWorkerId, onWorkerSelect]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-md border border-slate-200">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow z-[1000] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Customer
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Verified Worker
      </div>
    </div>
  );
};
