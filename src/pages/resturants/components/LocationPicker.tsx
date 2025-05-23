// components/location-picker.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  cityName: string;
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

const LocationMarker = ({
  initialPosition,
  onLocationSelect
}: {
  initialPosition?: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition || null
  );

  useMapEvents({
    click(e) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onLocationSelect(newPosition[0], newPosition[1]);
    }
  });

  return position ? <Marker position={position} /> : null;
};

export const LocationPicker = ({
  cityName,
  onLocationSelect,
  initialPosition
}: LocationPickerProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setMapCenter([parseFloat(lat), parseFloat(lon)]);
          if (!initialPosition) {
            onLocationSelect(parseFloat(lat), parseFloat(lon));
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching city coordinates:', error);
        setLoading(false);
      }
    };

    if (cityName) {
      fetchCityCoordinates();
    }
  }, [cityName, initialPosition, onLocationSelect]);

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="h-96 w-full overflow-hidden rounded-md">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          initialPosition={initialPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};
