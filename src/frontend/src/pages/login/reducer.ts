import { FormState, ReducerAction } from "./types";

export default function reducer(state: FormState, action: ReducerAction) {
  if (action.type === "SET_VALUE") {
    switch (action.field) {
      case "email":
        return {
          ...state,
          email: action.value,
        };
      case "password":
        return {
          ...state,
          password: action.value,
        };
    }
  }
  console.error("Undefined action");
  return state;
}
