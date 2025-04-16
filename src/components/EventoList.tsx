import { useEffect, useState } from "react";
import { obtenerEventos } from "../services/eventosService";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

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
}

export const EventoList = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventoObtenidos = await obtenerEventos();
        setEventos(eventoObtenidos as Evento[]);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  if (loading) {
    return (
      <Box display={"flex"} justifyContent={"center"} sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={6}>
      <Typography variant="h5" gutterBottom>
        Lista de Eventos
      </Typography>
      <Grid container spacing={2}>
        {eventos.map((evento) => (
          <Grid size={{ xs: 12, md: 6 }} key={evento.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{evento.servicio}</Typography>
                <Typography variant="body2">
                  Fecha: {evento.fecha} | Hora: {evento.horaInicio} -{" "}
                  {evento.horaFin}
                </Typography>
                <Typography variant="body2">
                  Ciudad: {evento.ciudad}
                </Typography>
                <Typography variant="body2">
                  Cliente: {evento.clienteNombre}
                </Typography>
                <Typography variant="body2">
                    Teléfono: {evento.clienteTelefono}
                </Typography>
                <Typography variant="body2">
                    Email: {evento.clienteEmail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
