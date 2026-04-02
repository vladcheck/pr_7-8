import { FormAction, FormState } from "./types";
import {
  MAX_ALLOWED_PRICE,
  MAX_TITLE_LENGTH,
  MIN_ALLOWED_PRICE,
} from "./const";

export default function reducer(
  state: FormState,
  action: FormAction,
): FormState {
  switch (action.field) {
    case "title":
      return {
        ...state,
        title:
          action.value.length > MAX_TITLE_LENGTH ? state.title : action.value,
      };
    case "category":
      return {
        ...state,
        category: action.value,
      };
    case "price": {
      let price: number;
      if (isNaN(action.value) || action.value < MIN_ALLOWED_PRICE) {
        price = MIN_ALLOWED_PRICE;
      } else if (action.value > MAX_ALLOWED_PRICE) {
        price = MAX_ALLOWED_PRICE;
      } else {
        price = action.value;
      }
      return {
        ...state,
        price,
      };
    }
    case "description":
      return {
        ...state,
        description: action.value,
      };
    default:
      return state;
  }
}
