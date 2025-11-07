import { auth } from "../firebase/config";
import { db } from "../firebase/db";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setRole(snap.data().role);
      }
    };

    loadUser();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bienvenido al Dashboard</h2>
      {role && <p>Rol: <b>{role}</b></p>}

      {/* ✅ Opciones para Reportero */}
      {role === "reportero" && (
        <>
          <p>✏️ Puedes crear y ver tus noticias</p>

          <button onClick={() => navigate("/crear-noticia")}>
            ➕ Crear Noticia
          </button>

          <button onClick={() => navigate("/noticias")}>
            📄 Mis Noticias
          </button>
        </>
      )}

      {role === "editor" && (
    <>
    <p>✅ Puedes aprobar y publicar noticias</p>

    <button onClick={() => window.location.href = "/noticias"}>📄 Ver Noticias</button>
    <button onClick={() => window.location.href = "/secciones"}>📂 Gestionar Secciones</button>
    </>
    )}

      {/* ✅ Opciones para Editor */}
      {role === "editor" && (
        <>
          <p>✅ Puedes revisar y aprobar noticias</p>

          <button onClick={() => navigate("/noticias")}>
            📄 Ver Noticias Pendientes
          </button>
        </>
      )}

      <br /><br />

      {/* 🌍 Link al sitio público */}
      <button onClick={() => navigate("/public-noticias")}>
        🌍 Ver Sitio Público
      </button>

      <br /><br />

      <button onClick={() => signOut(auth)}>🚪 Cerrar sesión</button>
    </div>
  );
}
