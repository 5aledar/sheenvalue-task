// MapComponent.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  lat: number;
  lng: number;
  onMapClick?: (lat: number, lng: number) => void;
}

// This is a plain JS implementation of Leaflet to avoid React context issues
const MapComponent = ({ lat, lng, onMapClick }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const initializedRef = useRef(false);
  const lastPositionRef = useRef<[number, number]>([lat, lng]);

  // Create custom icon
  const createIcon = () => {
    return L.icon({
      iconUrl: '/leaflet/marker-icon.png',
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      shadowUrl: '/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Initialize map only once on component mount
  useEffect(() => {
    if (!mapRef.current || initializedRef.current) return;

    // Fix Leaflet icon issues
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png'
    });

    console.log('Initializing map with center:', [lat, lng]);
    mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);

    // Add click handler
    if (onMapClick) {
      mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
        console.log('Map clicked at:', e.latlng);

        // Update marker directly without re-rendering component
        updateMarker(e.latlng.lat, e.latlng.lng);

        // Notify parent component
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    // Only add initial marker if coordinates are not the default Damascus coordinates
    if (lat !== 33.5138 || lng !== 36.2765) {
      markerRef.current = L.marker([lat, lng], { icon: createIcon() })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<b>Selected Location</b><br>Latitude: ${lat.toFixed(6)}<br>Longitude: ${lng.toFixed(6)}`
        )
        .openPopup();
    }

    initializedRef.current = true;
    lastPositionRef.current = [lat, lng];

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []); // Empty dependency array means this only runs once

  // Function to update marker position without re-rendering
  const updateMarker = (newLat: number, newLng: number) => {
    if (!mapInstanceRef.current) return;

    // Only update if position has changed
    if (
      lastPositionRef.current[0] !== newLat ||
      lastPositionRef.current[1] !== newLng
    ) {
      console.log('Updating marker to:', [newLat, newLng]);

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      markerRef.current = L.marker([newLat, newLng], { icon: createIcon() })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<b>Selected Location</b><br>Latitude: ${newLat.toFixed(6)}<br>Longitude: ${newLng.toFixed(6)}`
        )
        .openPopup();

      lastPositionRef.current = [newLat, newLng];
    }
  };

  // Update marker when props change
  useEffect(() => {
    if (initializedRef.current && mapInstanceRef.current) {
      updateMarker(lat, lng);
    }
  }, [lat, lng]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
