import { useContext, useEffect, useState } from "react";
import { Product } from "@/entities/Product";
import CatalogueProductCard from "./ui/CatalogueProductCard";
import ApiContext from "@/features/api/ApiContext";
import FlexContainer from "@/shared/ui/FlexContainer";
import useDebouncer from "@/shared/hooks/useDebouncer";
import Sidebar from "./ui/Sidebar";
import { Filters } from "./types";
import { FILTER_CONFIG } from "./const";

export default function ProductsPage() {
  const { api } = useContext(ApiContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({
    price: {
      min: FILTER_CONFIG.price.min,
      max: FILTER_CONFIG.price.max,
    },
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useDebouncer(
    () => {
      setFilteredProducts(
        products
          .filter((p) => p.price >= filters.price.min)
          .filter((p) => p.price <= filters.price.max),
      );
    },
    1000,
    [products, filters, filters.price.min, filters.price.max],
  );

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
      <Sidebar filters={filters} setFilters={setFilters} />
      <div className="w-300">
        {filteredProducts.length ? (
          <div className="flex-1 grid grid-cols-4 p-2 gap-2 justify-items-center justify-center">
            {filteredProducts.map((p) => (
              <CatalogueProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          <FlexContainer justify="center" align="center" className="gap-2">
            <h2 className="text-2xl">Мы не нашли товаров по вашему запросу</h2>
          </FlexContainer>
        )}
      </div>
    </FlexContainer>
  );
}
