import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/db";
import { doc, getDoc } from "firebase/firestore";

export default function NewsView() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        const ref = doc(db, "noticias", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          // mostrar solo si está publicada
          if (data.estado === "Publicado") {
            setNoticia(data);
          }
        }
      } catch (e) {
        console.error("Error cargando noticia:", e);
      }
      setCargando(false);
    };

    cargarNoticia();
  }, [id]);

  if (cargando) return <p>Cargando noticia...</p>;
  if (!noticia) return <p>❌ Noticia no encontrada o no está publicada</p>;

  const formatDate = (fecha) => {
    if (!fecha) return "";
    if (fecha.seconds) return new Date(fecha.seconds * 1000).toLocaleString();
    return new Date(fecha).toLocaleString();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <button onClick={() => window.history.back()} style={{ marginBottom: "15px" }}>
        ⬅ Volver
      </button>

      <h2>{noticia.titulo}</h2>
      <h4 style={{ color: "gray" }}>{noticia.subtitulo}</h4>

      {noticia.imagen && typeof noticia.imagen === "string" && noticia.imagen.indexOf && noticia.imagen.indexOf("http") === 0 && (
        <img src={noticia.imagen} alt={noticia.titulo} style={{ width: "100%", borderRadius: "6px", margin: "15px 0" }} />
      )}

      <p>{noticia.contenido}</p>

      <small>📅 {formatDate(noticia.fechaCreacion)} — ✍️ {noticia.autor}</small>
    </div>
  );
}
