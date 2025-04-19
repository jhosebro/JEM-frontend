import { db } from "../firebase/firebase";
import { addDoc, collection, getDocs} from "firebase/firestore";

export const crearEvento = async (evento: any) => {
  try {
    const docRef = await addDoc(collection(db, "eventos"), evento);
    console.log("Evento creado con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.log("Error al agregar el evento: ", error);
    throw error;
  }
};

export const obtenerEventos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "eventos"));
    const eventos= querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return eventos;
  } catch (error) {
    console.log("Error al obtener eventos: ", error);
    return []
  }
};
