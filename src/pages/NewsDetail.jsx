import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/db";
import { doc, getDoc } from "firebase/firestore";

export default function NewsDetail() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const ref = doc(db, "noticias", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setNoticia(snap.data());
    };
    cargar();
  }, [id]);

  if (!noticia) return <p>Cargando noticia...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>{noticia.titulo}</h2>
      <h4>{noticia.subtitulo}</h4>

      {noticia.imagen && (
        <img src={noticia.imagen} alt="" style={{ width: "100%", borderRadius: "8px", margin: "10px 0" }} />
      )}

      <p>{noticia.contenido}</p>

      <small>
        📅 {new Date(noticia.fechaCreacion.seconds * 1000).toLocaleString()}
      </small>
    </div>
  );
}
