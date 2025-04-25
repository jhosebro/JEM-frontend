import { useEffect, useState } from "react";
import { obtenerEventos } from "../services/eventosService";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RemoveRedEye } from "@mui/icons-material";

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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventoObtenidos = await obtenerEventos();
        setEventos(eventoObtenidos as Evento[]);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
        setError("Error al obtener eventos. Intente nuevamente más tarde.");
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
      {error && (
        <Snackbar
          open={!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert
            severity="error"
            sx={{ width: "100%" }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
      <Grid container spacing={2}>
        {eventos.map((evento) => (
          <Grid size={{ xs: 12, md: 4 }} key={evento.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ padding: 2 }}>
                <Typography variant="h6">{evento.servicio}</Typography>
                <Typography variant="body2">
                  Fecha: {evento.fecha} | Hora: {evento.horaInicio} -{" "}
                  {evento.horaFin}
                </Typography>
                <Typography variant="body2">Ciudad: {evento.ciudad}</Typography>
                <Typography variant="body2">
                  Cliente: {evento.clienteNombre}
                </Typography>
                <Typography variant="body2">
                  Teléfono: {evento.clienteTelefono}
                </Typography>
                <Typography variant="body2">
                  Email: {evento.clienteEmail}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/eventos/${evento.id}`)}
                  sx={{ mt: 2 }}
                ><RemoveRedEye sx={{marginRight: 1}}></RemoveRedEye>Ver más</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
