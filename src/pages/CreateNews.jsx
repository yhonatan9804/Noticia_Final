import { useState, useEffect } from "react";
import { db } from "../firebase/db";
import { auth } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateNews() {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);

  // ✅ Secciones desde Firestore
  const [secciones, setSecciones] = useState([]);

  const navigate = useNavigate();

  // ✅ Cargar secciones al entrar
  useEffect(() => {
    const cargarSecciones = async () => {
      const snap = await getDocs(collection(db, "secciones"));
      setSecciones(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    cargarSecciones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagen) {
      alert("Por favor selecciona una imagen 📸");
      return;
    }

    try {
      // ✅ Subir imagen a Cloudinary
      const data = new FormData();
      data.append("file", imagen);
      data.append("upload_preset", "noticias_upload");
      data.append("folder", "noticias");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/doypvrqp2/image/upload",
        data
      );

      const imagenURL = res.data.secure_url;

      // ✅ Guardar noticia en Firebase
      await addDoc(collection(db, "noticias"), {
        titulo,
        subtitulo,
        contenido,
        categoria,
        autor: auth.currentUser?.email || "desconocido",
        estado: "Edición",
        fechaCreacion: new Date(),
        imagen: imagenURL,
      });

      alert("✅ Noticia creada");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error al crear la noticia");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}
    >
      <h2>Crear noticia</h2>

      <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

      <input placeholder="Subtítulo" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} required />

      <textarea
        placeholder="Contenido"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        rows={5}
        required
      />

      {/* ✅ Select de Secciones desde Firestore */}
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
        <option value="">Seleccione sección</option>
        {secciones.map(sec => (
          <option key={sec.id} value={sec.nombre}>
            {sec.nombre}
          </option>
        ))}
      </select>

      <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} required />

      <button type="submit">Guardar noticia</button>
    </form>
  );
}
