import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateNews from "./pages/CreateNews";
import NewsList from "./pages/NewsList";
import PublicNews from "./pages/PublicNews";
import NewsDetail from "./pages/NewsDetail"; // ✅ Importar página de detalle
import NewsView from "./pages/NewsView";
import Sections from "./pages/Sections";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Página pública de noticias */}
        <Route path="/public-noticias" element={<PublicNews />} />

        {/* ✅ Página pública para ver una noticia */}
        <Route path="/noticia/:id" element={<NewsDetail />} />

        {/* Redirección al login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/noticia/:id" element={<NewsView />} />


        {/* ✅ Rutas protegidas */}
        <Route 
          path="/crear-noticia" 
          element={
            <ProtectedRoute>
              <CreateNews />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/noticias" 
          element={
            <ProtectedRoute>
              <NewsList />
            </ProtectedRoute>
          } 
        />
<Route 
  path="/secciones" 
  element={
    <ProtectedRoute>
      <Sections />
    </ProtectedRoute>
  }
/>

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}
