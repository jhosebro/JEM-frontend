import { useEffect, useState } from "react";
import { Evento } from "./EventoList";
import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

interface Inventario {
  id: string;
  nombre: string;
  categoria: string;
  cantidadDisponible: number;
}

interface AsignarInventarioProps {
  eventoId: string;
}

const AsignarInventario = ({ eventoId }: AsignarInventarioProps) => {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<{
    [key: string]: number;
  }>({});
  const [evento, setEvento] = useState<Evento | null>(null);


  const fetchInventario = async () => {
    const querySnapshot = await getDocs(collection(db, "inventario"));
    const inventarioData: Inventario[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Inventario[];
    setInventario(inventarioData);
  };
  useEffect(() => {


    fetchInventario();
  }, []);

  useEffect(() => {
    const fetchEvento = async () => {
      const eventoDoc = await getDoc(doc(db, "eventos", eventoId));
      if (eventoDoc.exists()) {
        setEvento(eventoDoc.data() as Evento);
      }
    };
    fetchEvento();
  }, [eventoId]);

  const handleChange = (event: SelectChangeEvent, productoId: string) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setProductosSeleccionados((prev) => ({
        ...prev,
        [productoId]: value,
      }));
    }
    
  };

  const handleAsignar = async () => {
    if (!eventoId) {
      console.error("El ID del evento no esta disponible");
      return;
    }

    const eventoRef = doc(db, "eventos", eventoId);
    const productosAsignados = Object.entries(productosSeleccionados).map(
      ([id, cantidad]) => ({
        id,
        cantidad,
      })
    );

    await updateDoc(eventoRef, {
      inventarioAsignado: productosAsignados,
    });

    for (const [id, cantidad] of Object.entries(productosSeleccionados)) {
        const producto = inventario.find(p=>p.id === id);
        if(!producto  || cantidad > producto.cantidadDisponible){
            alert(`Cantidad seleccionada para ${producto?.nombre || id} supera lo disponible` );
            return
        }
      const inventarioRef = doc(db, "inventario", id);
      await updateDoc(inventarioRef, {
        cantidadDisponible: increment(-cantidad),
      });

      const movimientoRef = collection(db, "movimientos_inventario");
      await addDoc(movimientoRef, {
        productoId: id,
        cantidadMovida: cantidad,
        tipoMovimiento: "Asignacion a evento",
        eventoId,
        fecha: new Date(),
      });
    }

    alert("Productos asignados correctamente")
    await fetchInventario();
    setProductosSeleccionados({})
  };
  return (
    <Card
      sx={{ borderRadius: 4, boxShadow: 3, overflow: "hidden", marginTop: 2 }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Asignar Inventario a Evento
        </Typography>
        {evento?.inventarioAsignado?.lenght > 0 && (<></>)}
        <Grid container spacing={3}>
          {inventario.map((producto) => (
            <Grid size={"auto"} key={producto.id}>
              <Card sx={{ padding: 2, boxShadow: 2 }}>
                <Typography variant="h6">{producto.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {producto.categoria}
                </Typography>
                <Typography variant="body1">
                  Disponible: {producto.cantidadDisponible}
                </Typography>
                <FormControl sx={{ marginTop: 2 }} fullWidth>
                  <Select
                    labelId={`select-cantidad-${producto.id}`}
                    value={
                      productosSeleccionados[producto.id]?.toString() || ""
                    }
                    onChange={(e) => handleChange(e, producto.id)}
                  >
                    <MenuItem value="">
                      <em>Seleccionar</em>
                    </MenuItem>
                    {[...Array(producto.cantidadDisponible)].map((_, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {index + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAsignar}
          sx={{ marginTop: 2 }}
        >
          Asignar productos
        </Button>
      </CardContent>
    </Card>
  );
};

export default AsignarInventario;
