import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useThemeMode } from "../contexts/ThemeContext";

const Configuracion = () => {
  const {darkMode, toggleDarkMode} = useThemeMode();
  const [notificaciones, setNotificaciones] = useState(true);

  const handleGuardar = () => {
    console.log("Preferencias guardadas:", {
      darkMode,
      notificaciones,
    });
  };
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Configuración
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
              />
            }
            label="Modo oscuro"
          />
          <FormControlLabel
            control={
              <Switch
                checked={notificaciones}
                onChange={(e) => setNotificaciones(e.target.checked)}
              />
            }
            label="Notificaciones"
          />
        </FormGroup>
        <Button variant="contained" sx={{ mt: 3 }} onClick={handleGuardar}>
          Guardar Cambios
        </Button>
      </Paper>
    </Box>
  );
};

export default Configuracion;
