import { Box, Button, Divider, Typography } from "@mui/material";
import { EventoList } from "../components/EventoList";
import { useNavigate } from "react-router-dom";

const Eventos = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Eventos
      </Typography>
      <Button onClick={() => handleNavigate("/eventos/crearEvento")} variant="contained" color="primary" sx={{ mt: 3 }}>
        Crear Evento
      </Button>
      <EventoList />
    </Box>
  );
};

export default Eventos;
