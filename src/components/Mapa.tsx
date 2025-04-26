import L, { icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapaProps {
  latitud: number;
  longitud: number;
}
export const Mapa: React.FC<MapaProps> = ({ latitud, longitud }: MapaProps) => {
  const posicion: [number, number] = [latitud, longitud]; // Reemplaza con las coordenadas deseadas

  return (
    <MapContainer
      center={posicion}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "300px", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={posicion}>
        <Popup>¡Hola! Esta es la ubicacion de este evento</Popup>
      </Marker>
    </MapContainer>
  );
};
