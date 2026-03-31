import { FormState, ReducerAction } from "./types";

export default function reducer(state: FormState, action: ReducerAction) {
  switch (action.type) {
    case "SET_VALUE": {
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
        case "roles":
          return {
            ...state,
            roles: action.value,
          };
        default:
          return state;
      }
    }
    default:
      return state;
  }
}
