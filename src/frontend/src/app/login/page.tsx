import { useReducer } from "react";
import { Link } from "react-router";
import SubmitButton from "../../shared/ui/SubmitButton";
import FlexContainer from "../../shared/ui/FlexContainer";
import Input from "../../shared/ui/Input";
import LabelInputBlock from "../../shared/ui/LabelInputBlock";

interface FormState {
  email: string;
  password: string;
}

const initialFormState: FormState = {
  email: "",
  password: "",
};

enum ReducerAction {
  "SET_EMAIL",
  "SET_PASSWORD",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: FormState, action: any) {
  switch (action.type) {
    case ReducerAction.SET_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case ReducerAction.SET_PASSWORD:
      return {
        ...state,
        password: action.password,
      };
    default:
      console.error("Undefined action");
      return state;
  }
}

export default function LoginPage() {
  const [formState, dispatch] = useReducer(reducer, initialFormState);

  const onSubmit = () => {};

  return (
    <FlexContainer flexDir="col" justify="center" align="center">
      <h1 className="text-2xl">Вход</h1>
      <form
        className="form flex flex-col justify-center items-center gap-2"
        id="login-form"
      >
        <LabelInputBlock htmlFor="email" label="Почта">
          <Input
            type="email"
            value={formState.email}
            onChange={() => {
              dispatch({ type: ReducerAction.SET_EMAIL });
            }}
            id="email"
            required
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="password" label="Пароль">
          <Input
            type="password"
            value={formState.password}
            onChange={() => {
              dispatch({ type: ReducerAction.SET_PASSWORD });
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
}
