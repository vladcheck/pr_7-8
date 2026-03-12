import { useContext, useEffect, useState } from "react";
import Product from "../../entities/Product";
import CatalogueProductCard from "./ui/CatalogueProductCard";
import ApiContext from "../../features/api/ApiContext";
import FlexContainer from "../../shared/ui/FlexContainer";
import LabelInputBlock from "../../shared/ui/LabelInputBlock";
import useDebouncer from "../../shared/hooks/useDebouncer";

const FILTER_CONFIG = {
  price: {
    min: 0,
    max: 10e4,
    step: 10,
  },
};

export default function ProductsPage() {
  const { api } = useContext(ApiContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
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
      <aside className="p-2 flex h-min flex-col min-w-50 border border-gray-200">
        <FlexContainer flexDir="col" className="gap-2">
          <LabelInputBlock htmlFor="min-price" label="Минимальная цена">
            <span>{filters.price.min}</span>
            <input
              type="range"
              name="min-price"
              id="min-price"
              value={filters.price.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  price: { ...filters.price, min: parseInt(e.target.value) },
                })
              }
              min={FILTER_CONFIG.price.min}
              max={filters.price.max}
              step={FILTER_CONFIG.price.step}
            />
          </LabelInputBlock>
          <LabelInputBlock htmlFor="min-price" label="Максимальная цена">
            <span>{filters.price.max}</span>
            <input
              type="range"
              name="min-price"
              id="min-price"
              value={filters.price.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  price: { ...filters.price, max: parseInt(e.target.value) },
                })
              }
              min={filters.price.min}
              max={FILTER_CONFIG.price.max}
              step={FILTER_CONFIG.price.step}
            />
          </LabelInputBlock>
        </FlexContainer>
      </aside>
      <div className="w-300">
        {filteredProducts.length ? (
          <div className="flex-1 grid grid-cols-4 p-2 gap-2 justify-items-center justify-center">
            {filteredProducts.map((p) => (
              <CatalogueProductCard key={p.id} p={p} />
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
