import { useContext, useEffect, useState } from "react";
import Product from "../../entities/Product";
import CatalogueProductCard from "./ui/CatalogueProductCard";
import ApiContext from "../../features/api/ApiContext";
import FlexContainer from "../../shared/ui/FlexContainer";

export default function ProductsPage() {
  const { api } = useContext(ApiContext);
  const [, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      ?.getProducts()
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [api]);

  return (
    <FlexContainer className="gap-4 pt-6">
      <aside className="p-2 flex h-min flex-col min-w-50 border border-gray-200"></aside>
      {filteredProducts ? (
        <div className="flex-1 grid grid-cols-5 p-2 gap-2 justify-items-center justify-center">
          {filteredProducts.map((p) => (
            <CatalogueProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <FlexContainer justify="center" align="center" className="gap-2">
          <h2 className="text-2xl">Мы не нашли товаров по вашему запросу</h2>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}
