import type { Product } from '@root-shared/types/Product';
import Button from '@/shared/ui/Button';
import FlexContainer from '@/shared/ui/FlexContainer';
import Price from '@/shared/ui/Price';

export default function ProductCardPreview({
	...p
}: Omit<Product, 'id' | 'author_id'>) {
	return (
		<FlexContainer flexDir="col" className="gap-4">
			<div className="w-80% h-100 bg-gray-300"></div>
			<FlexContainer className="gap-2">
				<FlexContainer flexDir="col" className="bg-gray-100 rounded-2xl p-4">
					<Price>{p.price}</Price>
					<h1 className="text-[1.4rem] max-w-100 wrap-break-word break-all">
						{p.title}
					</h1>
					<p>{p.description ?? 'Нет описания'}</p>
					<span>{p.category}</span>
					<FlexContainer className="gap-2" justify="between" align="center">
						<Button>Добавить в корзину</Button>
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
