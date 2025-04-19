import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { crearEvento } from "../services/eventosService";
import { useNavigate } from "react-router-dom";

interface EventFormData {
  fecha: string;
  ciudad: string;
  servicio: string;
  horaInicio: string;
  horaFin: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
}

const serviciosDisponibles = [
  "Alquiler de sonido",
  "Alquiler de luces",
  "Alquiler de efectos especiales",
  "Alquiler de mobiliario",
  "Alquiler de artistas",
  "Alquiler de grupos musicales",
  "Alquiler de Hora Loca",
];

export const CreateEventForm = ({
  onEventoCreado,
}: {
  onEventoCreado?: () => void;
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EventFormData>({
    fecha: "",
    ciudad: "",
    servicio: "",
    horaInicio: "",
    horaFin: "",
    clienteNombre: "",
    clienteTelefono: "",
    clienteEmail: "",
  });

  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [eventoId, setEventoId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
    navigate("/eventos");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Creando evento con datos:", formData);
      const id = await crearEvento(formData);
      console.log("Evento creado con éxito");
      setEventoId(id);
      setOpenSnackbar(true);
      onEventoCreado?.();
      setFormData({
        fecha: "",
        ciudad: "",
        servicio: "",
        horaInicio: "",
        horaFin: "",
        clienteNombre: "",
        clienteTelefono: "",
        clienteEmail: "",
      });
    } catch (error: any) {
      console.error("Error al crear el evento:", error);
      const mensaje =
        error?.message ||
        "Error al crear el evento. Por favor, inténtelo de nuevo.";
      setErrorMessage(mensaje);
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Crear Evento
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Fecha del evento"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              required
              name="servicio"
              label="Servicio"
              value={formData.servicio}
              onChange={handleChange}
            >
              {serviciosDisponibles.map((servicio) => (
                <MenuItem key={servicio} value={servicio}>
                  {servicio}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Hora de inicio"
              type="time"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="time"
              name="horaFin"
              label="Hora de finalización"
              value={formData.horaFin}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Nombre del cliente"
              name="clienteNombre"
              value={formData.clienteNombre}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              type="tel"
              fullWidth
              required
              label="Teléfono del cliente"
              name="clienteTelefono"
              value={formData.clienteTelefono}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              type="email"
              fullWidth
              required
              label="Email del cliente"
              name="clienteEmail"
              value={formData.clienteEmail}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <Button type="submit" variant="contained" color="success">
            {loading ? "Creando..." : "Crear Evento"}
          </Button>
          <Button
            onClick={() => navigate("/eventos")}
            variant="contained"
            color="primary"
          >
            Volver a la lista de eventos
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity="success"
            sx={{ width: "100%" }}
          >
            ¡Evento creado satisfactoriamente! ID: {eventoId}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={2000}
          onClose={() => setErrorMessage(null)}
        >
          <Alert
            onClose={() => setErrorMessage(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};
