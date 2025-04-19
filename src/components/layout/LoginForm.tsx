import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase/firebase";
import { Box, Button, TextField, Typography } from "@mui/material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("¡Login exitoso!");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      mt={5}
    >
      <Typography variant="h5">Iniciar Sesión</Typography>
      <TextField
        label="Correo Electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
      fullWidth/>
      <Button variant="contained" sx={{backgroundColor:"black"}} onClick={handleLogin}>
        Ingresar
      </Button>
    </Box>
  );
};

export default LoginForm;
