import { Route, Routes } from "react-router";
import LoginPage from "./app/login/page.tsx";
import RegisterPage from "./app/register/page.tsx";
import RootLayout from "./app/layout.tsx";
import Page from "./app/page.tsx";
import ProductsPage from "./app/products/page.tsx";
import ProductPage from "./app/products/[:id]/page.tsx";

export default function SiteRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Page />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
