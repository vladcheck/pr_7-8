import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import useUserInfo from '@/features/api/hooks/useUserInfo';
import useApi from '@/features/api/useApi';
import useCart from '@/features/cart/useCart';
import useNotify from '@/features/notifications/useNotify';
import logo from '@/shared/svg/logo.svg';
import Button from '@/shared/ui/Button';
import FlexContainer from '@/shared/ui/FlexContainer';
import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import Main from '@/shared/ui/Main';
import ProfileImage from '@/shared/ui/ProfileImage';

const RootLayout = observer(function RootLayout() {
	const api = useApi();
	const userInfo = useUserInfo();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const cart = useCart();
	const notify = useNotify();

	useEffect(() => {
		api
			.isLoggedIn()
			.then((v) => setIsLoggedIn(v))
			.catch(() => setIsLoggedIn(false));
	}, [api]);

	const cartTotalItems = Array.from(cart.getCartItems().values()).reduce(
		(a, b) => a + b,
		0,
	);

	const startPayment = () => {
		if (cartTotalItems === 0) {
			notify.notifyWarning('Ваша корзина пуста!');
			return;
		}
		notify.notifySuccess('Оплата прошла успешно! Ваш заказ оформлен.', 3000);
		cart.clearCart();
	};

	return (
		<div id="root">
			<Header className="w-dvw flex justify-between items-center px-6 py-3 gap-4 border-b-amber-600 border-b-2">
				<Link to={'/shop'}>
					<FlexContainer className="gap-4">
						<img
							src={logo}
							alt="logo"
							width={32}
							height={32}
							className="rounded-sm"
						/>
						<h1 className="text-2xl">E-commerce</h1>
					</FlexContainer>
				</Link>
				<input
					className="flex-1 border border-black px-2 py-0.5 max-w-200"
					type="search"
					name="productSearch"
					id="product-search"
				/>
				<FlexContainer className="gap-4 align-center items-center">
					<FlexContainer className="items-center bg-gray-100 px-3 py-1 rounded-full border border-gray-300 mr-2 shadow-sm">
						<span className="font-bold text-primary mr-3 text-lg">
							🛒 {cartTotalItems}
						</span>
						<Button
							onClick={startPayment}
							className="bg-primary text-white hover:bg-violet-600 rounded-2xl text-sm border-none shadow px-3 !py-1"
						>
							Оплатить
						</Button>
					</FlexContainer>
					{!isLoggedIn ? (
						<>
							<Link
								to={'/register'}
								className="text-gray-700 hover:text-primary transition-colors"
							>
								Зарегистрироваться
							</Link>
							<Link
								to={'/login'}
								className="font-medium text-primary hover:text-violet-600 transition-colors"
							>
								Войти
							</Link>
						</>
					) : (
						<>
							{userInfo?.roles.includes('admin') && (
								<Link
									to={'/admin/users'}
									className="text-gray-700 hover:text-primary"
								>
									Админ
								</Link>
							)}
							{userInfo?.roles.includes('seller') && (
								<Link
									to={'/products/create'}
									className="text-gray-700 hover:text-primary"
								>
									Добавить
								</Link>
							)}
							<ProfileImage to={'/profile'} />
						</>
					)}
				</FlexContainer>
			</Header>
			<Main className="flex flex-col items-center">
				<Outlet />
			</Main>
			<Footer />
			<ToastContainer />
		</div>
	);
});

export default RootLayout;
