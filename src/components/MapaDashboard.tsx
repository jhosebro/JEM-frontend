import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import blueMarker from "../assets/marker-icon-blue.png";
import yellowMarker from "../assets/marker-icon-yellow.png";
import redMarker from "../assets/marker-icon-red.png";
import greenMarker from "../assets/marker-icon-green.png";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Card, CardContent, Typography } from "@mui/material";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Evento {
  id: string;
  fecha: string;
  ciudad: string;
  servicio: string;
  horaInicio: string;
  horaFin: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  latitud: number; // Agregar latitud
  longitud: number; // Agregar longitud
}

export const MapaDashboard = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      const querySnapshot = await getDocs(collection(db, "eventos"));
      const eventosData: Evento[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Evento[];
      setEventos(eventosData);
    };
    fetchEventos();
  }, []);

  const getMarkerIcon = (servicio: string) => {
    let iconUrl = blueMarker; // Default to blue marker

    if (servicio.toLowerCase().includes("iluminación")) {
      iconUrl = yellowMarker;
    } else if (servicio.toLowerCase().includes("sonido")) {
      iconUrl = redMarker;
    } else if (servicio.toLowerCase().includes("mobiliario")) {
      iconUrl = greenMarker;
    }
    return new L.Icon({
      iconUrl: iconUrl,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const centro: [number, number] = [3.6927785, -76.3149873];

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3, overflow: "hidden" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Mapa de todos los eventos
        </Typography>
        <MapContainer
          center={centro}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "300px", width: "100%", borderRadius: "16px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          ></TileLayer>
          {eventos.map((evento) => {
            if (
              evento.latitud === undefined ||
              evento.longitud === undefined ||
              isNaN(evento.latitud) ||
              isNaN(evento.longitud)
            ) {
              return null;
            }

            return (
              <Marker
                key={evento.id}
                position={[evento.latitud, evento.longitud]}
                icon={getMarkerIcon(evento.servicio)}
              >
                <Popup>
                  <strong>{evento.clienteNombre}</strong>
                  <br />
                  {evento.ciudad} - {evento.servicio}
                  <br />
                  Fecha: {evento.fecha}
                  <br />
                  Hora: {evento.horaInicio} - {evento.horaFin}
                  <br />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
};
