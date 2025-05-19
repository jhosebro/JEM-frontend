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
  runTransaction,
  Transaction,
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
  tipo: string;
  cantidadDisponible: number;
}

interface AsignarInventarioProps {
  eventoId: string;
}

const AsignarInventario = ({ eventoId }: AsignarInventarioProps) => {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState<{
    [key: string]: number;
  }>({});
  const [evento, setEvento] = useState<Evento | null>(null);

  const fetchInventario = async () => {
    const querySnapshot = await getDocs(collection(db, "inventario"));
    const inventarioData: Inventario[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre || "Sin nombre",
        tipo: data.tipo || "Sin categoria",
        cantidadDisponible: data.cantidadDisponible || 0,
      };
    });
    setInventario(inventarioData);
  };
  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchEvento = async () => {
    const eventoDoc = await getDoc(doc(db, "eventos", eventoId));
    if (eventoDoc.exists()) {
      const eventoData = eventoDoc.data();
      console.log("Evento cargado: ", eventoData);
      if (!eventoData?.inventarioAsignado) {
        console.warn("Este evento no tiene inventario asignado");
      }
      setEvento(eventoData as Evento);
    }
  };
  useEffect(() => {
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
    if (loading) return;
    setLoading(true); // 🔐 Bloqueamos múltiples clics

    try {
      await runTransaction(db, async (transaction) => {
        const eventoRef = doc(db, "eventos", eventoId);
        const eventoDoc = await transaction.get(eventoRef);
        if (!eventoDoc.exists()) throw new Error("Evento no encontrado");

        const eventoData = eventoDoc.data() as Evento;
        const inventarioAnterior = eventoData.inventarioAsignado || [];

        // Creamos mapa con cantidades anteriores
        const inventarioMap = new Map<string, number>();
        inventarioAnterior.forEach((item) => {
          inventarioMap.set(item.id, item.cantidad);
        });

        // Validación de cantidades
        for (const [id, cantidadNueva] of Object.entries(
          productosSeleccionados
        )) {
          const productoRef = doc(db, "inventario", id);
          const productoSnap = await transaction.get(productoRef);
          if (!productoSnap.exists())
            throw new Error(`Producto ${id} no existe`);

          const productoData = productoSnap.data() as Inventario;
          const cantidadAsignadaAnterior = inventarioMap.get(id) || 0;

          if (cantidadNueva <= 0) {
            throw new Error(`Cantidad inválida para ${productoData.nombre}`);
          }

          if (cantidadNueva > productoData.cantidadDisponible) {
            throw new Error(
              `Stock insuficiente para ${productoData.nombre}. Disponibles: ${productoData.cantidadDisponible}`
            );
          }
        }

        // Actualizamos cantidades en inventario y en el evento
        for (const [id, cantidadNueva] of Object.entries(
          productosSeleccionados
        )) {
          const productoRef = doc(db, "inventario", id);
          const cantidadAnterior = inventarioMap.get(id) || 0;
          inventarioMap.set(id, cantidadAnterior + cantidadNueva);

          transaction.update(productoRef, {
            cantidadDisponible: increment(-cantidadNueva),
          });

          // También registramos el movimiento fuera del transaction (luego)
        }

        const inventarioActualizado = Array.from(inventarioMap.entries()).map(
          ([id, cantidad]) => ({ id, cantidad })
        );

        transaction.update(eventoRef, {
          inventarioAsignado: inventarioActualizado,
        });
      });

      // Fuera de la transacción: registrar movimientos
      for (const [id, cantidad] of Object.entries(productosSeleccionados)) {
        await addDoc(collection(db, "movimientos_inventario"), {
          productoId: id,
          cantidadMovida: cantidad,
          tipoMovimiento: "Asignacion a evento",
          eventoId,
          fecha: new Date(),
        });
      }

      alert("Inventario asignado correctamente");
      await fetchInventario();
      const eventoRef = doc(db, "eventos", eventoId);
      const updatedEvento = await getDoc(eventoRef);
      if (updatedEvento.exists()) {
        setEvento(updatedEvento.data() as Evento);
      }
      setProductosSeleccionados({});
    } catch (error) {
      console.error("Error en transacción:", error);
      alert(`Error asignando inventario: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLiberarInventario = async () => {
    if (!eventoId || !evento?.inventarioAsignado?.length) {
      alert("Este evento no tiene inventario asignado");
      return;
    }

    const eventoRef = doc(db, "eventos", eventoId);

    for (const item of evento.inventarioAsignado) {
      const inventarioRef = doc(db, "inventario", item.id);
      await updateDoc(inventarioRef, {
        cantidadDisponible: increment(item.cantidad),
      });

      const movimientoRef = collection(db, "movimientos_inventario");
      await addDoc(movimientoRef, {
        productoId: item.id,
        cantidadMovida: item.cantidad,
        tipoMovimiento: "Liberacion de inventario del evento",
        eventoId,
        fecha: new Date(),
      });
    }

    await updateDoc(eventoRef, {
      inventarioAsignado: [],
    });

    alert("Inventario liberado correctamente");

    await fetchInventario();
    const updatedEvento = await getDoc(eventoRef);
    if (updatedEvento.exists()) {
      setEvento(updatedEvento.data() as Evento);
    }
  };
  return (
    <Card
      sx={{ borderRadius: 4, boxShadow: 3, overflow: "hidden", marginTop: 2 }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Asignar Inventario a Evento
        </Typography>
        {evento?.inventarioAsignado && evento.inventarioAsignado.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Inventario ya asignado:
            </Typography>
            <ul>
              {evento?.inventarioAsignado?.map((item) => {
                const producto = inventario.find((p) => p.id === item.id);
                return (
                  <li key={item.id}>
                    {producto?.nombre || item.id} - Cantidad: {item.cantidad}
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <Grid container spacing={3}>
          {inventario.map((producto) => (
            <Grid size={"auto"} key={producto.id}>
              <Card sx={{ padding: 2, boxShadow: 2 }}>
                <Typography variant="h6">{producto.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {producto.tipo}
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
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          Asignar productos
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLiberarInventario}
          sx={{ marginTop: 2, marginLeft: 2 }}
        >
          {" "}
          Liberar inventario asignado
        </Button>
      </CardContent>
    </Card>
  );
};

export default AsignarInventario;
