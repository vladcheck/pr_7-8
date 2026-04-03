import type { Product } from '@root-shared/types/Product';
import { useEffect, useState } from 'react';
import useUserInfo from '@/features/api/hooks/useUserInfo';
import useApi from '@/features/api/useApi';
import useDebouncer from '@/shared/hooks/useDebouncer';
import FlexContainer from '@/shared/ui/FlexContainer';
import { FILTER_CONFIG } from './const';
import type { Filters } from './types';
import CatalogueProductCard from './ui/CatalogueProductCard';
import Sidebar from './ui/Sidebar';

export default function ProductsPage() {
	const api = useApi();
	const userInfo = useUserInfo();
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
				setProducts(res.data.items);
				setFilteredProducts(res.data.items);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [api]);

	return (
		userInfo && (
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
							<h2 className="text-2xl">
								Мы не нашли товаров по вашему запросу
							</h2>
						</FlexContainer>
					)}
				</div>
			</FlexContainer>
		)
	);
}
