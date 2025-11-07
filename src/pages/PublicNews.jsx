import { useEffect, useState } from "react";
import { db } from "../firebase/db";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function PublicNews() {
  const [secciones, setSecciones] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // ✅ Cargar secciones
        const secSnap = await getDocs(collection(db, "secciones"));
        const lista = secSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSecciones(lista);

        // ✅ Cargar noticias publicadas
        const ref = collection(db, "noticias");
        const q = query(
          ref,
          where("estado", "==", "Publicado"),
          orderBy("fechaCreacion", "desc")
        );

        const snap = await getDocs(q);
        setNoticias(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error cargando noticias públicas", err);
      }
      setCargando(false);
    };

    cargar();
  }, []);

  if (cargando) return <p>Cargando noticias...</p>;

  const formatDate = (fecha) => {
    if (!fecha) return "";
    if (fecha.seconds) return new Date(fecha.seconds * 1000).toLocaleString();
    return new Date(fecha).toLocaleString();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>📰 Noticias por sección</h2>

      {secciones.map(sec => {
        const noticiasFiltradas = noticias.filter(n => n.categoria === sec.nombre);

        return (
          <div key={sec.id} style={{ marginBottom: "25px" }}>
            <h3 style={{ borderBottom: "2px solid black", paddingBottom: "5px" }}>
              {sec.nombre}
            </h3>

            {noticiasFiltradas.length === 0 && (
              <p>📭 No hay noticias en esta sección aún</p>
            )}

            {noticiasFiltradas.map(n => (
              <div key={n.id} style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                margin: "15px 0",
                padding: "10px"
              }}>
                <h4
                  onClick={() => window.location.href = `/noticia/${n.id}`}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  {n.titulo}
                </h4>

                <b>{n.subtitulo}</b>

                {n.imagen && typeof n.imagen === "string" && n.imagen.indexOf("http") === 0 && (
                  <img
                    src={n.imagen}
                    alt={n.titulo}
                    style={{ width: "100%", borderRadius: "6px", marginTop: "10px" }}
                  />
                )}

                <p>{n.contenido}</p>
                <small>📅 {formatDate(n.fechaCreacion)}</small>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
