import { Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/CategoryPage";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";

export default function AppRoutes() {
  return (
    <Routes>
      {/* layout principal com header/footer */}
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
      </Route>

      {/* rotas fora do layout (sem header/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
