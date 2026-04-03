import type { Product } from '@root-shared/types/Product';
import { useState } from 'react';
import Button from '@/shared/ui/Button';
import FlexContainer from '@/shared/ui/FlexContainer';
import Price from '@/shared/ui/Price';

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
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const images = p?.images?.length ? p.images : ['/images/placeholder.webp'];

	const nextImage = () =>
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	const prevImage = () =>
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

	return (
		<FlexContainer
			flexDir="col"
			className="gap-6 glass-panel p-6 max-w-[900px] w-full mx-auto my-8"
		>
			<FlexContainer className="gap-8 flex-col md:flex-row">
				{/* Carousel Section */}
				<div className="relative w-full md:w-1/2 h-[400px] rounded-2xl overflow-hidden shadow-lg group bg-surface-hover flex items-center justify-center">
					<img
						src={
							images[currentImageIndex].startsWith('http')
								? images[currentImageIndex]
								: `http://localhost:3000/images/products${images[currentImageIndex].replace('/images/products', '')}`
						}
						alt={p.title}
						className="object-cover w-full h-full transition-opacity duration-500"
					/>
					{images.length > 1 && (
						<>
							<Button
								onClick={prevImage}
								className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg backdrop-blur-sm"
							>
								&#10094;
							</Button>
							<Button
								onClick={nextImage}
								className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/90 text-white rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg backdrop-blur-sm"
							>
								&#10095;
							</Button>
							<div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 bg-black/20 px-3 py-2 rounded-full backdrop-blur-sm">
								{images.map((image, i) => (
									<div
										key={image}
										className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
									/>
								))}
							</div>
						</>
					)}
				</div>

				{/* Product Details Section */}
				<FlexContainer flexDir="col" className="flex-1 justify-between py-2">
					<div className="space-y-4">
						<span className="text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
							{p.category}
						</span>
						<h1 className="text-3xl font-extrabold leading-tight break-words text-text-color">
							{p.title}
						</h1>
						<div className="text-3xl text-amber-500 font-bold bg-amber-500/10 inline-block px-4 py-2 rounded-xl">
							<Price>{p.price}</Price>
						</div>
						<p className="text-text-muted text-base leading-relaxed whitespace-pre-wrap">
							{p.description}
						</p>
					</div>

					<FlexContainer
						className="gap-4 mt-8 flex-col sm:flex-row"
						align="center"
					>
						{inCart > 0 ? (
							<FlexContainer
								align="center"
								className="rounded-xl bg-surface-hover border border-border-color p-1 gap-4 shadow-sm w-full sm:w-auto justify-center"
							>
								<Button
									onClick={() => onRemoveFromCart(p.id)}
									className="w-10 h-10 rounded-lg bg-surface text-text-color hover:bg-red-50 hover:text-red-500 font-bold text-xl transition-colors shadow-sm cursor-pointer"
								>
									-
								</Button>
								<span className="text-xl font-bold w-6 text-center text-primary">
									{inCart}
								</span>
								<Button
									onClick={onAddToCart}
									className="w-10 h-10 rounded-lg bg-surface text-text-color hover:bg-green-50 hover:text-green-500 font-bold text-xl transition-colors shadow-sm cursor-pointer"
								>
									+
								</Button>
							</FlexContainer>
						) : (
							<Button
								onClick={onAddToCart}
								className="btn-primary w-full sm:w-auto py-3 text-lg font-bold shadow-xl shadow-primary/40"
							>
								В корзину
							</Button>
						)}
						<Button className="glass-panel w-full sm:w-auto px-6 py-3 font-semibold text-text-color hover:bg-surface-hover border-2 border-transparent hover:border-border-color transition-colors shadow-none text-lg cursor-pointer">
							Купить в 1 клик
						</Button>
					</FlexContainer>
				</FlexContainer>
			</FlexContainer>

			{/* Reviews */}
			<div className="w-full mt-6 bg-surface-hover rounded-2xl p-6 border border-border-color">
				<h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
					Отзывы{' '}
					<span className="bg-gray-200 text-gray-500 text-sm py-1 px-3 rounded-full font-medium">
						0
					</span>
				</h2>
				<div className="py-8 text-center bg-surface border border-dashed border-border-color rounded-xl">
					<span className="text-text-muted italic block mb-2">
						Пока нет отзывов. Станьте первым!
					</span>
					<Button className="text-primary font-medium hover:underline cursor-pointer cursor-pointer">
						Написать отзыв
					</Button>
				</div>
			</div>
		</FlexContainer>
	);
}
