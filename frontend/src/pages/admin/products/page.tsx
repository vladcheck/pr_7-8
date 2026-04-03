import useApi from "@/features/api/useApi";
import useNotify from "@/features/notifications/useNotify";
import CatalogueProductCard from "@/pages/products/ui/CatalogueProductCard";
import { Product } from "@root-shared/types/Product";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const api = useApi();
  const notifier = useNotify();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .getProducts()
      .then((response) => setProducts(response.data.items))
      .catch((error) => notifier.notifyError(error));
  }, [api]);

  return (
    <main>
      {products.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {products.map((p) => (
            <CatalogueProductCard key={p.id} {...p} />
          ))}
        </div>
      ) : (
        <div>Товары не найдены. Попробуйте позже.</div>
      )}
    </main>
  );
}
