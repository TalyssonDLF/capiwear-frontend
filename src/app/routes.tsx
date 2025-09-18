import { Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/CategoryPage"; 

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} /> {}
      </Route>
    </Routes>
  );
}