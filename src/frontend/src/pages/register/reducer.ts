import { FormState, ReducerAction } from "./types";

export default function reducer(state: FormState, action: ReducerAction) {
  if (action.type === "SET_VALUE") {
    switch (action.field) {
      case "firstName":
        return {
          ...state,
          firstName: action.value,
        };
      case "lastName":
        return {
          ...state,
          lastName: action.value,
        };
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
      case "submitPassword":
        return {
          ...state,
          submitPassword: action.value,
        };
    }
  }
  console.error("Undefined action");
  return state;
}
