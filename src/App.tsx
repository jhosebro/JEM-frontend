import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "leaflet/dist/leaflet.css";
import Eventos from "./pages/Eventos";
import Inventario from "./pages/Inventario";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Perfil from "./pages/Perfil";
import Configuracion from "./pages/Configuracion";
import CrearEventoPage from "./pages/CrearEventoPage";
import { EventoDetalle } from "./pages/EventoDetalle";
import { Layout } from "./layout/Layout";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/eventos"
            element={
              <PrivateRoute>
                <Eventos />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <PrivateRoute>
                <Inventario />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/configuracion"
            element={
              <PrivateRoute>
                <Configuracion />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/eventos/crearEvento"
            element={
              <PrivateRoute>
                <CrearEventoPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/eventos/:id"
            element={
              <PrivateRoute>
                <EventoDetalle />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
