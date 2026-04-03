import type { UserLoginResponse } from '@root-shared/types/User';
import type { AxiosResponse } from 'axios';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import useApi from '@/features/api/useApi';
import { authStore } from '@/features/auth/AuthStore';
import useNotify from '@/features/notifications/useNotify';
import FlexContainer from '@/shared/ui/FlexContainer';
import Input from '@/shared/ui/Input';
import LabelInputBlock from '@/shared/ui/LabelInputBlock';
import SubmitButton from '@/shared/ui/SubmitButton';

const LoginPage = observer(function LoginPage() {
	const navigate = useNavigate();
	const notifier = useNotify();
	const formRef = useRef<HTMLFormElement>(null);
	const api = useApi();
	const formState = useLocalObservable(() => ({
		email: '',
		password: '',
	}));

	const onSubmit = () => {
		if (
			formRef.current?.checkValidity() &&
			formState.email &&
			formState.password
		) {
			api
				.login(formState)
				.then((response: AxiosResponse<UserLoginResponse>) => {
					const { accessToken, refreshToken, uid } = response.data;
					// Note: roles are not returned by login currently, we'd need to fetch /me or include them in JWT
					authStore.setAuth(accessToken, refreshToken, uid, []);
					notifier.notifySuccess(`Вы вошли в аккаунт ${formState.email}`);
					setTimeout(() => {
						navigate('/shop');
					}, 2000);
				})
				.catch((error: string) => {
					notifier.notifyError(error);
					console.error(error);
				});
		}
	};

	return (
		<FlexContainer flexDir="col" justify="center" align="center">
			<h1 className="text-2xl">Вход</h1>
			<form
				ref={formRef}
				className="form flex flex-col justify-center items-center gap-2"
				id="login-form"
			>
				<LabelInputBlock htmlFor="email" label="Почта">
					<Input
						type="email"
						value={formState.email}
						onChange={(e) => {
							runInAction(() => {
								formState.email = e.target.value;
							});
						}}
						id="email"
						required
					/>
				</LabelInputBlock>
				<LabelInputBlock htmlFor="password" label="Пароль">
					<Input
						type="password"
						value={formState.password}
						onChange={(e) => {
							runInAction(() => {
								formState.password = e.target.value;
							});
						}}
						id="password"
						required
					/>
				</LabelInputBlock>
			</form>
			<FlexContainer
				flexDir="col"
				justify="center"
				align="center"
				className="mt-6 gap-4"
			>
				<SubmitButton formId="login-form" onClick={onSubmit}>
					Войти
				</SubmitButton>
				<Link to="/register">Создать аккаунт</Link>
			</FlexContainer>
		</FlexContainer>
	);
});

export default LoginPage;
