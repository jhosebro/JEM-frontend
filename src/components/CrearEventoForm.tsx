import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
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
  "Alquiler de Hora Loca"
];

export const CreateEventForm = () => {
  const navigate = useNavigate();

  const handleNavigate = (path:string) => {
    navigate(path);
  }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await crearEvento(formData);
      alert("Evento creado con éxito!");

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
    } catch (error) {
      alert("Error al crear el evento. Por favor, inténtelo de nuevo.");
    }
  };

  return (
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
            fullWidth
            required
            label="Email del cliente"
            name="clienteEmail"
            value={formData.clienteEmail}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"} spacing={2} sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
        >
          Crear Evento
        </Button>
        <Button
          onClick={() => handleNavigate("/eventos")}
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Volver a la lista de eventos
        </Button>
      </Grid>
    </Box>
  );
};
