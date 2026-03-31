import { Product } from "@/entities/Product";
import Button from "@/shared/ui/Button";
import FlexContainer from "@/shared/ui/FlexContainer";
import Price from "@/shared/ui/Price";

export default function FullProductCard({
  p,
  inCart = 0,
  onAddToCart,
  onRemoveFromCart,
}: {
  p: Product;
  inCart?: number;
  onAddToCart: () => void;
  onRemoveFromCart: (id: string) => void;
}) {
  return (
    <FlexContainer flexDir="col" className="gap-4">
      <FlexContainer className="gap-2">
        <ProductImageCarousel src={p.imageSrc} alt={p.imageAlt} />
        <FlexContainer flexDir="col" className="bg-gray-100 rounded-2xl p-4">
          <Price>{p.price}</Price>
          <h1 className="text-[1.4rem] max-w-100 wrap-break-word break-all">
            {p.title}
          </h1>
          <span className="score">SCORE_IN_HERE</span>
          <p>{p.description}</p>
          <span>{p.category}</span>
          <FlexContainer className="gap-2" justify="between" align="center">
            {inCart > 0 && (
              <FlexContainer
                align="center"
                className="rounded-md bg-gray-300 px-2 py-1 gap-2 h-7 w-24"
              >
                <Button
                  onClick={() => {
                    onRemoveFromCart(p.id);
                  }}
                  className="w-6 h-6 p-0"
                >
                  -
                </Button>
                <Button
                  onClick={() => {
                    onAddToCart();
                  }}
                  className="w-6 h-6 p-0"
                >
                  +
                </Button>
                <span className="text-[1rem]">{inCart}</span>
              </FlexContainer>
            )}
            <Button onClick={onAddToCart}>Добавить в корзину</Button>
            <Button>Заказать прямо сейчас</Button>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer flexDir="col" className="bg-gray-100 p-4 rounded-2xl">
        <h2 className="text-[1.2rem]">Отзывы</h2>
        <span>Нет отзывов</span>
      </FlexContainer>
    </FlexContainer>
  );
}

function ProductImageCarousel({
  src,
  alt = "",
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <div className="carousel overflow-x-scroll overflow-y-hidden bg-gray-100 rounded-2xl aspect-auto p-4 min-w-50">
      {src && <img src={src} alt={alt} />}
    </div>
  );
}
