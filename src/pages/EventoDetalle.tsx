import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import MapaSelector from "../components/MapaSelector";
import { Mapa } from "../components/Mapa";


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
  latitud?: number;
  longitud?: number;
}

export const EventoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Evento | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  //* Funcion que valida que la informacion ingresada para el formulario sea correcta
  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[0-9]{7,}$/;

    if (!form?.servicio) nuevosErrores.servicio = "El servicio es requerido.";
    if (!form?.fecha) nuevosErrores.fecha = "La fecha es requerida.";
    if (!form?.horaInicio)
      nuevosErrores.horaInicio = "La hora de inicio es requerida.";
    //* Validar que la hora de inicio sea menor a la hora de fin
    if (!form?.horaFin) {
      nuevosErrores.horaFin = "La hora de fin es requerida.";
    } else if (form?.horaInicio && form?.horaFin) {
      const horaInicio = new Date(`${form.fecha}T${form.horaInicio}`);
      let horaFin = new Date(`${form.fecha}T${form.horaFin}`);
      if (horaFin <= horaInicio) {
        horaFin.setDate(horaFin.getDate() + 1);
      }
      if (horaFin <= horaInicio) {
        nuevosErrores.horaFin = "La hora de fin debe ser mayor a la de inicio.";
      }
    }
    if (!form?.ciudad) nuevosErrores.ciudad = "La ciudad es requerida.";
    if (!form?.clienteNombre)
      nuevosErrores.clienteNombre = "El nombre del cliente es requerido.";
    if (!form?.clienteTelefono) {
      nuevosErrores.clienteTelefono = "El teléfono del cliente es requerido.";
    } else if (!telefonoRegex.test(form.clienteTelefono)) {
      nuevosErrores.clienteTelefono =
        "El teléfono del cliente debe tener al menos 7 dígitos.";
    }
    if (!form?.clienteEmail) {
      nuevosErrores.clienteEmail = "El email del cliente es requerido.";
    } else if (!emailRegex.test(form.clienteEmail)) {
      nuevosErrores.clienteEmail = "El email del cliente es inválido.";
    }

    //* Validar que la fecha no sea pasada
    if (form?.fecha) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaEvento = new Date(form.fecha);
      if (fechaEvento < hoy) {
        nuevosErrores.fecha = "La fecha del evento no puede ser pasada.";
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const docRef = doc(db, "eventos", id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvento({ id: docSnap.id, ...docSnap.data() } as Evento);
        } else {
          setError("Evento no encontrado.");
        }
      } catch (error) {
        console.error("Error al obtener el evento:", error);
        setError("Error al obtener el evento. Intente nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [id]);

  useEffect(() => {
    if (evento) setForm(evento);
  }, [evento]);

  if (loading) {
    return (
      <Box display={"flex"} justifyContent={"center"} sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!evento) {
    return null;
  }

  const handleEliminar = async () => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar este evento?"
    );
    if (!confirm || !id) return;

    try {
      await deleteDoc(doc(db, "eventos", id));
      alert("Evento eliminado con éxito.");
      navigate("/eventos");
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      setError("Error al eliminar el evento. Intente nuevamente más tarde.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm!,
      [name]: value,
    }));
  };

  const handleActualizar = async () => {
    if (!id || !form) return;
    if (!validarFormulario()) return;

    try {
      await updateDoc(doc(db, "eventos", id), { ...form });
      setEditMode(false);
      setEvento(form);
      setSnackbar({
        open: true,
        message: "Evento actualizado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      setSnackbar({
        open: true,
        message: "Error al actualizar el evento. Intente nuevamente más tarde.",
        severity: "error",
      });
    }
  };

  return (
    <Box mt={6}>
      <Box display={"flex"} justifyContent="space-between" mb={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          color="primary"
          variant="contained"
          sx={{ mb: 2 }}
        >
          Volver
        </Button>
        <Box display={"flex"} gap={2}>
          <Button
            startIcon={<Edit />}
            variant="contained"
            color="success"
            onClick={() => setEditMode(true)}
            sx={{ mb: 2, ml: 2 }}
          >
            Editar evento
          </Button>
          <Button
            color="error"
            startIcon={<Delete />}
            variant="contained"
            onClick={handleEliminar}
            sx={{ mb: 2, ml: 2 }}
          >
            Eliminar Evento
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ padding: 3 }}>
          {editMode && form ? (
            <>
              <Typography variant="h6" gutterBottom>
                Editar Evento
              </Typography>
              <Grid container spacing={2} mb={2}>
                {[
                  { label: "Servicio", field: "servicio" },
                  { label: "Fecha", field: "fecha", type: "date" },
                  { label: "Hora Inicio", field: "horaInicio", type: "time" },
                  { label: "Hora Fin", field: "horaFin", type: "time" },
                  { label: "Ciudad", field: "ciudad" },
                  { label: "Cliente Nombre", field: "clienteNombre" },
                  { label: "Cliente Telefono", field: "clienteTelefono" },
                  {
                    label: "Cliente Email",
                    field: "clienteEmail",
                    type: "email",
                  },
                ].map(({ label, field, type }) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      name={field}
                      value={(form as any)[field]}
                      type={type || "text"}
                      onChange={handleInputChange}
                      error={!!errors[field]}
                      helperText={errors[field]}
                      InputLabelProps={
                        type === "date" || type === "time"
                          ? { shrink: true }
                          : undefined
                      }
                    ></TextField>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Ubicacion del evento
              </Typography>
              <Box mt={1}>
                <MapaSelector
                  ubicacionInicial={{
                    lat: form?.latitud || 3.6927785,
                    lng: form?.longitud || -76.3149873,
                  }}
                  onUbicacionSeleccionada={(lat, lng) =>
                    setForm((prev) => ({
                      ...prev!,
                      latitud: lat,
                      longitud: lng,
                    }))
                  }
                />
              </Box>
              {(() => {
                const horaInicio = new Date(
                  `${evento.fecha}T${evento.horaInicio}`
                );
                let horaFin = new Date(`${evento.fecha}T${evento.horaFin}`);
                if (horaFin <= horaInicio) {
                  horaFin.setDate(horaFin.getDate() + 1);
                  return (
                    <Typography variant="body1">
                      * Este evento se extiende hasta el dia siguiente:{" "}
                      {horaFin.toLocaleDateString()}
                    </Typography>
                  );
                }
              })()}
              <Box display={"flex"} justifyContent="end" gap={2}>
                <Button
                  startIcon={<Save />}
                  variant="contained"
                  color="success"
                  onClick={handleActualizar}
                >
                  Guardar Cambios
                </Button>
                <Button
                  startIcon={<Cancel />}
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setEditMode(false), setErrors({});
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {evento.servicio}
              </Typography>
              <Typography variant="body1">
                <strong>Fecha:</strong> {evento.fecha}
              </Typography>
              <Typography variant="body1">
                <strong>Hora:</strong> {evento.horaInicio} - {evento.horaFin}
              </Typography>
              {(() => {
                const horaInicio = new Date(
                  `${evento.fecha}T${evento.horaInicio}`
                );
                let horaFin = new Date(`${evento.fecha}T${evento.horaFin}`);
                if (horaFin <= horaInicio) {
                  horaFin.setDate(horaFin.getDate() + 1);
                  return (
                    <Typography variant="body1">
                      * Este evento se extiende hasta el dia siguiente:{" "}
                      {horaFin.toLocaleDateString()}
                    </Typography>
                  );
                }
              })()}
              <Typography variant="body1">
                <strong>Ciudad:</strong> {evento.ciudad}
              </Typography>
              <Typography variant="body1">
                <strong>Cliente:</strong> {evento.clienteNombre}
              </Typography>
              <Typography variant="body1">
                <strong>Telefono:</strong> {evento.clienteTelefono}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {evento.clienteEmail}
              </Typography>
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Ubicacion en el mapa
                </Typography>
                {evento.latitud && evento.longitud ? (
                  <Mapa latitud={evento.latitud} longitud={evento.longitud} />
                ) : (
                  <Typography variant="body1">
                    No hay coordenadas disponible para este evento
                  </Typography>
                )}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
