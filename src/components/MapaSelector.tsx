import L from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
interface MapaSelectorProps {
  onUbicacionSeleccionada: (lat: number, lng: number) => void;
  ubicacionInicial?: { lat: number; lng: number };
}

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapaSelector = ({
  onUbicacionSeleccionada,
  ubicacionInicial = { lat: 3.6927785, lng: -76.3149873 },
}: MapaSelectorProps) => {
  const [posicion, setPosicion] = useState(ubicacionInicial);

  const ManejadorEventos = () => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosicion({ lat, lng });
            onUbicacionSeleccionada(lat, lng);
        }
    })
    return null;
  }

  return (
    <MapContainer center={posicion} zoom={13} style={{ height: "300px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        <ManejadorEventos />
        <Marker position={posicion} icon={icon}>
            
        </Marker>
    </MapContainer>
  )
};

export default MapaSelector;
