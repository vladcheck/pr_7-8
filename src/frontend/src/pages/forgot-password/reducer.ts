import { FormAction, FormState } from "./types";

export default function reducer(
  state: FormState,
  action: FormAction,
): FormState {
  if (action.type === "SET_VALUE") {
    switch (action.field) {
      case "email":
        return { ...state, email: action.value };
      case "name":
        return { ...state, name: action.value };
      case "newPassword":
        return { ...state, newPassword: action.value };
      default:
        return state;
    }
  }
  console.error(`Undefined action type ${action.type}`);
  return state;
}
