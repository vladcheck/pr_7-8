import { Link } from "react-router";
import Product from "../../../entities/Product.ts";
import FlexContainer from "../../../shared/ui/FlexContainer.tsx";
import Price from "../../../shared/ui/Price.tsx";

export default function CatalogueProductCard({ p }: { p: Product }) {
  return (
    <FlexContainer
      flexDir="col"
      justify="center"
      align="center"
      className="h-full w-full border-3 border-red-900"
    >
      <FlexContainer flexDir="col" justify="center" className="w-full">
        <Link to={`/products/${p.id}`}>
          {p.images?.[0] ? (
            <img className="min-w-40 w-max aspect-4/5" src="" alt="" />
          ) : (
            <div className="min-w-40 w-max aspect-4/5 bg-gray-200"></div>
          )}
        </Link>
        <span>{p.category}</span>
        <Price>{p.price}</Price>
        <Link to={`/products/${p.id}`}>
          <h2 className="text-[1.2rem]">{p.title}</h2>
        </Link>
        {p.description && (
          <p className="break-after-all wrap-break-word text-gray-600">
            {p.description}
          </p>
        )}
      </FlexContainer>
    </FlexContainer>
  );
}
