import { auth, db } from "../firebase/firebase";
import { addDoc, collection, getDocs} from "firebase/firestore";

export const crearEvento = async (evento: any) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const eventoConUID = {
    ...evento,
    uid: user.uid,
    fechaCreacion: new Date(),
  }
  try {
    const docRef = await addDoc(collection(db, "eventos"), eventoConUID);
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
