import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import JDL from "../assets/IMG_7619.png";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  ImageListItem,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth } from "../firebase/firebase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    if(!email || !password){
      setErrorMsg("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error: any) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-credential":
          setErrorMsg("Correo o contraseña inválidos.");
          break;
        default:
          setErrorMsg("Error inesperado. Por favor, intenta nuevamente.");
          break;
      }
    }
  };

  return (
    <Box display={"flex"} justifyContent={"center"} mt={5}>
      <Paper elevation={3} sx={{ padding: 3, width: 350 }}>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems={"center"}
          gap={2}
          mt={5}
        >
          <Grid container justifyContent="center" mb={2}>
            <Grid size={{ xs: 12, md: 12 }}>
              <ImageListItem sx={{ width: 150, height: 150, mx: "auto" }}>
                {" "}
                <img src={JDL} />
              </ImageListItem>
            </Grid>
          </Grid>
          <Typography variant="h5">Iniciar Sesión</Typography>
          {errorMsg && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorMsg}
            </Alert>
          )}
          <TextField
            autoFocus={true}
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "black" }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
