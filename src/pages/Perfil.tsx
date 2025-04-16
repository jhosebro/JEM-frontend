import { Avatar, Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Perfil = () => {
  const { user } = useAuth();
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Perfil del Usuario
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Avatar
              src={user?.photoURL || "https://i.pravatar.cc/150"}
              sx={{ width: 150, height: 150, mx: "auto" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={user?.displayName || ""}
              margin="normal"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              fullWidth
              label="Correo electronico"
              value={user?.email || ""}
              margin="normal"
              slotProps={{ input: { readOnly: true } }}
            />
            <Button variant="contained" sx={{mt:2}}>
                Editar Perfil "Proximamente"
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Perfil;
