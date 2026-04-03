import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import SubmitButton from "@/shared/ui/SubmitButton";
import FlexContainer from "@/shared/ui/FlexContainer";
import Input from "@/shared/ui/Input";
import LabelInputBlock from "@/shared/ui/LabelInputBlock";
import useApi from "@/features/api/useApi";
import useNotify from "@/features/notifications/useNotify";
import { observer, useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";

const LoginPage = observer(function LoginPage() {
  const navigate = useNavigate();
  const notifier = useNotify();
  const formRef = useRef<HTMLFormElement>(null);
  const api = useApi();
  const formState = useLocalObservable(() => ({
    email: "",
    password: "",
  }));

  const onSubmit = () => {
    if (
      formRef.current?.checkValidity() &&
      formState.email &&
      formState.password
    ) {
      api
        .login(formState)
        .then(() => {
          notifier.notifySuccess(`Вы вошли в аккаунт ${formState.email}`);
          setTimeout(() => {
            navigate("/shop");
          }, 2000);
        })
        .catch((error) => {
          notifier.notifyError(error as string);
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
