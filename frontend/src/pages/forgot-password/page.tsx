import { useReducer } from "react";
import { FormState } from "./types";
import reducer from "./reducer";
import FlexContainer from "@/shared/ui/FlexContainer";
import useApi from "@/features/api/useApi";
import SubmitButton from "@/shared/ui/SubmitButton";
import LabelInputBlock from "@/shared/ui/LabelInputBlock";
import Input from "@/shared/ui/Input";

const initialState: FormState = {
  name: "",
  email: "",
  newPassword: "",
};

const FORM_ID = "reset-password-form";

export default function ForgotPasswordPage() {
  const api = useApi();
  const [state, dispatch] = useReducer(reducer, initialState);

  const onSubmit = async () => {
    await api.resetPassword(state);
  };

  return (
    <FlexContainer>
      <h1>Сброс пароля</h1>
      <form id={FORM_ID}>
        <LabelInputBlock label="Имя" htmlFor="name">
          <Input
            type="text"
            value={state.name}
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "name",
                value: e.target.value,
              });
            }}
            required
          />
        </LabelInputBlock>
        <LabelInputBlock label="Почта" htmlFor="email">
          <Input
            type="text"
            value={state.name}
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "email",
                value: e.target.value,
              });
            }}
            required
          />
        </LabelInputBlock>
        <LabelInputBlock label="Имя" htmlFor="name">
          <Input
            type="text"
            value={state.name}
            onChange={(e) => {
              dispatch({
                type: "SET_VALUE",
                field: "name",
                value: e.target.value,
              });
            }}
            required
          />
        </LabelInputBlock>
      </form>
      <SubmitButton onClick={onSubmit} formId={FORM_ID}>
        Сбросить пароль
      </SubmitButton>
    </FlexContainer>
  );
}
