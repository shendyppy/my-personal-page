"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import L from "leaflet";

// FIX: Import Leaflet marker assets
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Patch default icon so it works in Next.js/Vite builds
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

export const LocationMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  const latitude = -6.269261848505568;
  const longitude = 106.73569185343422;
  const location = "Tangerang Selatan, Indonesia";

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Initialize map
    leafletMap.current = L.map(mapRef.current).setView(
      [latitude, longitude],
      13
    );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap.current);

    // Add marker
    L.marker([latitude, longitude])
      .addTo(leafletMap.current)
      .bindPopup(`<b>${location}</b>`)
      .openPopup();

    return () => {
      leafletMap.current?.remove(); // cleanup
      leafletMap.current = null;
    };
  }, [latitude, longitude, location]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-600" />
          My Location
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Map */}
        <div ref={mapRef} className="h-72 w-full rounded-lg z-0" />
      </CardContent>
    </Card>
  );
};
