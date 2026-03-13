import { Route, Routes } from "react-router";
import LoginPage from "./app/login/page.tsx";
import RegisterPage from "./app/register/page.tsx";
import RootLayout from "./app/layout.tsx";
import Page from "./app/page.tsx";
import ProductsPage from "./app/products/page.tsx";
import ProductPage from "./app/products/[:id]/page.tsx";
import CreateProductPage from "./app/products/create/page.tsx";
import NotFoundPage from "./app/notFound.tsx";
import ProfilePage from "./app/profile/page.tsx";

export default function SiteRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Page />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
