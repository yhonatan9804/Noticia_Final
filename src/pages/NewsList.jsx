import { useEffect, useState } from "react";
import { db } from "../firebase/db";
import { auth } from "../firebase/config";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";

export default function NewsList() {
  console.log("✅ Entró a NewsList");

  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const loadNoticias = async () => {
      try {
        const ref = collection(db, "noticias");
        const q = query(ref, orderBy("fechaCreacion", "desc"));
        const snap = await getDocs(q);

        const datos = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNoticias(datos);
      } catch (err) {
        console.error("Error cargando noticias:", err);
      }
      setCargando(false);
    };

    loadNoticias();
  }, []);

  if (cargando) return <p>Cargando noticias...</p>;

  // Editor publica: Terminado -> Publicado
  const publicarNoticia = async (id) => {
    const ref = doc(db, "noticias", id);
    await updateDoc(ref, { estado: "Publicado" });
    alert("✅ Noticia publicada");
    window.location.reload();
  };

  // Reportero marca Edición -> Terminado
  const terminarNoticia = async (id) => {
    const ref = doc(db, "noticias", id);
    await updateDoc(ref, { estado: "Terminado" });
    alert("✅ Noticia marcada como Terminada");
    window.location.reload();
  };

  return (
    <div>
      <h2>Noticias creadas</h2>

      {noticias.length === 0 && <p>No hay noticias aún</p>}

      {noticias.map(n => (
        <div key={n.id} style={{
          border: "1px solid #aaa",
          borderRadius: "8px",
          margin: "12px 0",
          padding: "10px"
        }}>
          
          <h3>{n.titulo}</h3>
          <p><b>Subtítulo:</b> {n.subtitulo}</p>

          {n.imagen && typeof n.imagen === "string" && n.imagen.indexOf && n.imagen.indexOf("http") === 0 && (
            <img 
              src={n.imagen} 
              alt="Noticia" 
              style={{ width: "200px", margin: "10px 0", borderRadius: "8px" }} 
            />
          )}

          <p><b>Contenido:</b> {n.contenido}</p>
          <p><b>Categoría:</b> {n.categoria}</p>
          <p><b>Estado:</b> {n.estado}</p>
          <p><b>Autor:</b> {n.autor}</p>

          {/* Reportero: ver su noticia y marcar como Terminado */}
          {user?.email === n.autor && n.estado === "Edición" && (
            <button 
              onClick={() => terminarNoticia(n.id)} 
              style={{ marginTop: "10px", background: "#0284c7", color: "white" }}
            >
              ✅ Marcar como Terminada
            </button>
          )}

          {/* Editor: si la noticia está en Terminado, puede Publicar */}
          {user?.email !== n.autor && n.estado === "Terminado" && (
            <button 
              onClick={() => publicarNoticia(n.id)} 
              style={{ marginTop: "10px", background: "#16a34a", color: "white" }}
            >
              🟢 Publicar noticia
            </button>
          )}

        </div>
      ))}
    </div>
  );
}
