import { useReducer, useRef } from "react";
import { Link, useNavigate } from "react-router";
import SubmitButton from "@/shared/ui/SubmitButton";
import FlexContainer from "@/shared/ui/FlexContainer";
import Input from "@/shared/ui/Input";
import LabelInputBlock from "@/shared/ui/LabelInputBlock";
import TextInput from "@/shared/ui/TextInput";
import useApi from "@/features/api/useApi";
import { FormState } from "./types";
import reducer from "./reducer";
import { UserRole } from "@root-shared/types/User";

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  password: "",
  submitPassword: "",
  email: "",
  roles: ["user"],
};

export default function RegisterPage() {
  const api = useApi();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, dispatch] = useReducer(reducer, initialFormState);

  const onSubmit = async () => {
    if (formRef.current?.checkValidity()) {
      api
        .createUser(formState)
        .then(() => {
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <FlexContainer flexDir="col" justify="center" align="center">
      <h1 className="text-2xl">Регистрация</h1>
      <form
        ref={formRef}
        className="form flex flex-col justify-center items-center gap-2"
        id="register-form"
      >
        <LabelInputBlock htmlFor="role" label="Роль">
          <select
            name="role"
            id="role"
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "roles",
                value: [
                  ...formState.roles,
                  ...[...e.target.selectedOptions].map(
                    (opt) => opt.value as UserRole,
                  ),
                ],
              });
            }}
            defaultValue={["user"]}
            multiple
          >
            <option value="user">Обычный пользователь</option>
            <option value="admin">Администратор</option>
            <option value="seller">Продавец</option>
          </select>
        </LabelInputBlock>
        <LabelInputBlock htmlFor="firstName" label="Имя">
          <TextInput
            value={formState.firstName}
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "firstName",
                value: e.target.value,
              });
            }}
            id="firstName"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="lastName" label="Фамилия">
          <TextInput
            value={formState.lastName}
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "lastName",
                value: e.target.value,
              });
            }}
            id="lastName"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="email" label="Почта">
          <Input
            type="email"
            value={formState.email}
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "email",
                value: e.target.value,
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
              dispatch({
                type: "SET_VALUE",
                field: "password",
                value: e.target.value,
              });
            }}
            id="password"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="submitPassword" label="Подтвердите пароль">
          <Input
            type="password"
            value={formState.submitPassword}
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "submitPassword",
                value: e.target.value,
              });
            }}
            id="submitPassword"
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
        <SubmitButton formId="register-form" onClick={onSubmit}>
          Зарегистрироваться
        </SubmitButton>
        <Link to="/login">Войти</Link>
        <Link to="/forgot-password">Забыли пароль?</Link>
      </FlexContainer>
    </FlexContainer>
  );
}
