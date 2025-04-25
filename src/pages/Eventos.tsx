import { Box, Button, Typography } from "@mui/material";
import { EventoList } from "../components/EventoList";
import { useNavigate } from "react-router-dom";

const Eventos = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <Box sx={{maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Box display={"flex"} justifyContent="center">
        <Typography variant="h2">
          Eventos
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent="end">
      <Button
        onClick={() => handleNavigate("/eventos/crearEvento")}
        variant="contained"   
        color="primary"
        sx={{ mt: 3 }}
      >
        Crear Evento
      </Button>
      </Box>
      <EventoList />
    </Box>
  );
};

export default Eventos;
