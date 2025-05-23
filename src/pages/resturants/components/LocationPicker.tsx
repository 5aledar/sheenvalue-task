// components/location-picker.tsx
'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { Input } from '@/components/ui/input';

// Lazy load the MapComponent to avoid SSR issues
const MapComponent = lazy(() => import('./MapComponent'));

interface LocationPickerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialLat?: string;
  initialLng?: string;
}

// Main LocationPicker component
export const LocationPicker = ({
  onLocationSelect,
  initialLat = '33.5138',
  initialLng = '36.2765'
}: LocationPickerProps) => {
  // State for coordinates
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  // Update coordinates when input fields change
  const updateCoordinates = (newLat: number, newLng: number) => {
    if (!isNaN(newLat) && !isNaN(newLng) && onLocationSelect) {
      onLocationSelect(newLat, newLng);
    }
  };

  // Handle map click
  const handleMapClick = (newLat: number, newLng: number) => {
    console.log('LocationPicker received map click:', { newLat, newLng });
    setLat(newLat.toFixed(6));
    setLng(newLng.toFixed(6));

    if (onLocationSelect) {
      onLocationSelect(newLat, newLng);
    }
  };

  // Log when props change
  useEffect(() => {
    console.log('LocationPicker props updated:', { initialLat, initialLng });
  }, [initialLat, initialLng]);

  return (
    <div className="w-full">
      <div className="h-80 w-full overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          }
        >
          {/* Use a key to prevent re-rendering on every coordinate change */}
          <MapComponent
            key="map-component"
            lat={parseFloat(lat) || 33.5138}
            lng={parseFloat(lng) || 36.2765}
            onMapClick={handleMapClick}
          />
        </Suspense>
      </div>

      {/* Latitude and longitude inputs hidden as requested */}
      <div className="hidden">
        <Input
          id="latitude"
          value={lat}
          onChange={(e) => {
            setLat(e.target.value);
            const validLat = parseFloat(e.target.value);
            const validLng = parseFloat(lng);
            updateCoordinates(validLat, validLng);
          }}
        />
        <Input
          id="longitude"
          value={lng}
          onChange={(e) => {
            setLng(e.target.value);
            const validLat = parseFloat(lat);
            const validLng = parseFloat(e.target.value);
            updateCoordinates(validLat, validLng);
          }}
        />
      </div>
    </div>
  );
};
