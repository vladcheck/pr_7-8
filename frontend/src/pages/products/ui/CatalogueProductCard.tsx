import { Link } from "react-router";
import { Product } from "@/entities/Product.ts";
import FlexContainer from "@/shared/ui/FlexContainer.tsx";
import Price from "@/shared/ui/Price.tsx";

export default function CatalogueProductCard(p: Product) {
  return (
    <Link to={`/products/${p.id}`}>
      <FlexContainer flexDir="col" className="h-full w-full px-1 shadow-2xs">
        <Link to={`/products/${p.id}`}>
          <h2 className="text-[1.2rem]">{p.title}</h2>
        </Link>
        {p.description && (
          <p className="break-after-all nowrap text-gray-600 truncate overflow-clip">
            {p.description}
          </p>
        )}
        <span>{p.category}</span>
        <Price>{p.price}</Price>
      </FlexContainer>
    </Link>
  );
}
