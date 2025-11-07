import { useEffect, useState } from "react";
import { db } from "../firebase/db";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from "../firebase/config";

export default function Sections() {
  const [secciones, setSecciones] = useState([]);
  const [nuevaSeccion, setNuevaSeccion] = useState("");
  const [editando, setEditando] = useState(null);
  const [valorEditar, setValorEditar] = useState("");

  const user = auth.currentUser;

  const cargar = async () => {
    const snap = await getDocs(collection(db, "secciones"));
    setSecciones(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    cargar();
  }, []);

  const agregar = async () => {
    if (!nuevaSeccion.trim()) return alert("Ingrese un nombre");
    
    await addDoc(collection(db, "secciones"), { nombre: nuevaSeccion });
    setNuevaSeccion("");
    cargar(); // ✅ refresca sin recargar página
  };

  const eliminar = async (id) => {
    await deleteDoc(doc(db, "secciones", id));
    cargar();
  };

  const guardarEdicion = async (id) => {
    await updateDoc(doc(db, "secciones", id), { nombre: valorEditar });
    setEditando(null);
    cargar();
  };

  // ✅ Solo editor puede gestionar secciones
  if (user?.email !== "editor@correo.com") {
    return <p>❌ No tienes permiso para administrar secciones</p>;
  }

  return (
    <div>
      <h2>📂 Administrar Secciones</h2>

      <input
        placeholder="Nueva sección"
        value={nuevaSeccion}
        onChange={(e) => setNuevaSeccion(e.target.value)}
      />
      <button onClick={agregar}>➕ Crear</button>

      <hr />

      {secciones.map(sec => (
        <div key={sec.id} style={{ marginBottom: "10px" }}>
          {editando === sec.id ? (
            <>
              <input 
                value={valorEditar}
                onChange={(e) => setValorEditar(e.target.value)}
              />
              <button onClick={() => guardarEdicion(sec.id)}>💾 Guardar</button>
              <button onClick={() => setEditando(null)}>❌ Cancelar</button>
            </>
          ) : (
            <>
              <b>{sec.nombre}</b>
              <button onClick={() => { setEditando(sec.id); setValorEditar(sec.nombre); }}>✏️ Editar</button>
              <button onClick={() => eliminar(sec.id)}>🗑 Eliminar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
