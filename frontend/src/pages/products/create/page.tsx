import { useReducer } from "react";
import FlexContainer from "@/shared/ui/FlexContainer";
import SubmitButton from "@/shared/ui/SubmitButton";
import { FormAction } from "./types";
import TextInput from "@/shared/ui/TextInput";
import Input from "@/shared/ui/Input";
import LabelInputBlock from "@/shared/ui/LabelInputBlock";
import useApi from "@/features/api/useApi";
import FullProductCard from "../ui/FullProductCard";

const MIN_ALLOWED_PRICE = 1;
const MAX_ALLOWED_PRICE = 10e6;
const MAX_TITLE_LENGTH = 200;
const FORM_ID = "create-product-form";

const CATEGORIES = [
  "Еда",
  "Косметика",
  "Посуда",
  "Канцелярия",
  "Техника",
  "Игрушки для детей",
  "Другое",
];

interface FormState {
  title: string;
  description: string;
  price: number;
  category: string;
}

const initialState: FormState = {
  title: "",
  description: "",
  price: MIN_ALLOWED_PRICE,
  category: "Другое",
};

function reducer(
  state: FormState,
  action: {
    type: FormAction;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
): FormState {
  switch (action.type) {
    case FormAction.SET_TITLE:
      return {
        ...state,
        title:
          action.title.length > MAX_TITLE_LENGTH ? state.title : action.title,
      };
    case FormAction.SET_CATEGORY:
      return {
        ...state,
        category: action.category,
      };
    case FormAction.SET_PRICE: {
      let price: number;
      if (isNaN(action.price) || action.price < MIN_ALLOWED_PRICE) {
        price = MIN_ALLOWED_PRICE;
      } else if (action.price > MAX_ALLOWED_PRICE) {
        price = MAX_ALLOWED_PRICE;
      } else {
        price = action.price;
      }
      return {
        ...state,
        price,
      };
    }
    case FormAction.SET_DESCRIPTION:
      return {
        ...state,
        description: action.description,
      };
    default:
      return state;
  }
}

export default function CreateProductPage() {
  const api = useApi();
  const [state, dispatch] = useReducer(reducer, initialState);

  const onSubmit = () => {
    if (!state.title || !state.price || !state.category) return;
    api
      .createProduct(state)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <FlexContainer className="gap-8" justify="center" align="center">
      <div className="preview">
        <FullProductCard
          p={{ ...state, id: "" }}
          inCart={0}
          onAddToCart={() => {}}
          onRemoveFromCart={() => {}}
        />
      </div>
      <div className="information">
        <form className="form flex flex-col gap-4" id={FORM_ID}>
          <h1 className="text-2xl">Информация о товаре</h1>
          <LabelInputBlock label="Полное наименование товара" htmlFor="title">
            <TextInput
              value={state.title}
              onChange={(e) => {
                dispatch({ type: FormAction.SET_TITLE, title: e.target.value });
              }}
              min={3}
              max={MAX_TITLE_LENGTH}
              id="title"
              required
            />
          </LabelInputBlock>
          <LabelInputBlock htmlFor="price" label="Цена, в рублях">
            <Input
              type="number"
              value={state.price}
              min={MIN_ALLOWED_PRICE}
              max={MAX_ALLOWED_PRICE}
              onChange={(e) => {
                dispatch({
                  type: FormAction.SET_PRICE,
                  price: parseInt(e.target.value),
                });
              }}
              id="price"
              required
            />
          </LabelInputBlock>
          <LabelInputBlock label="Категория" htmlFor="category">
            <select
              onChange={(e) => {
                dispatch({
                  type: FormAction.SET_CATEGORY,
                  category: e.target.value,
                });
              }}
              value={state.category}
              name="category"
              id="category"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </LabelInputBlock>
          <LabelInputBlock label="Описание" htmlFor="description">
            <textarea
              minLength={10}
              maxLength={2000}
              value={state.description}
              onChange={(e) => {
                dispatch({
                  type: FormAction.SET_DESCRIPTION,
                  description: e.target.value,
                });
              }}
              name="description"
              id="description"
              required
            ></textarea>
          </LabelInputBlock>
        </form>
        <SubmitButton onClick={onSubmit} formId={FORM_ID}>
          Опубликовать
        </SubmitButton>
      </div>
    </FlexContainer>
  );
}
