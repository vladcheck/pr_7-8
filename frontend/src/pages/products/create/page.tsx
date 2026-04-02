import { useReducer, useRef } from "react";
import FlexContainer from "@/shared/ui/FlexContainer";
import SubmitButton from "@/shared/ui/SubmitButton";
import { FormState } from "./types";
import TextInput from "@/shared/ui/TextInput";
import Input from "@/shared/ui/Input";
import LabelInputBlock from "@/shared/ui/LabelInputBlock";
import useApi from "@/features/api/useApi";
import reducer from "./reducer";
import {
  CATEGORIES,
  FORM_ID,
  MAX_ALLOWED_PRICE,
  MAX_TITLE_LENGTH,
  MIN_ALLOWED_PRICE,
} from "./const";
import ProductCardPreview from "./ui/ProductCardPreview";
import Textarea from "@/shared/ui/Textarea";
import useNotify from "@/features/notifications/useNotify";
import { useNavigate } from "react-router";
import useUserInfo from "@/features/api/hooks/useUserInfo";
import ProtectedRouteError from "@/widgets/ProtectedRouteError";

export const initialState: FormState = {
  title: "",
  description: "",
  price: MIN_ALLOWED_PRICE,
  category: "Другое",
};

export default function CreateProductPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const api = useApi();
  const formRef = useRef<HTMLFormElement>(null);
  const notifier = useNotify();
  const navigate = useNavigate();
  const userInfo = useUserInfo();

  const onSubmit = () => {
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    if (!userInfo) {
      return;
    }
    api
      .createProduct({ ...state, author_id: userInfo?.id })
      .then(() => {
        notifier.notifySuccess(
          "Товар опубликован, сейчас вас перекинет на страницу профиля.",
          2000,
        );
        setTimeout(() => navigate("/profile"), 2000);
      })
      .catch((error) => {
        notifier.notifyError(error);
      });
  };

  if (userInfo && !userInfo?.roles.includes("seller")) {
    if (!userInfo?.roles.includes("admin")) {
      return <ProtectedRouteError reason="Вы не являетесь продавцом." />;
    }
  }

  return (
    <FlexContainer className="gap-8" justify="center" align="center">
      <div className="preview">{<ProductCardPreview {...state} />}</div>
      <div className="information">
        <form ref={formRef} className="form flex flex-col gap-4" id={FORM_ID}>
          <h1 className="text-2xl">Информация о товаре</h1>
          <LabelInputBlock label="Полное наименование товара" htmlFor="title">
            <TextInput
              value={state.title}
              onChange={(e) => {
                dispatch({
                  type: "SET_VALUE",
                  field: "title",
                  value: e.target.value,
                });
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
                  type: "SET_VALUE",
                  field: "price",
                  value: parseInt(e.target.value),
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
                  type: "SET_VALUE",
                  field: "category",
                  value: e.target.value,
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
            <Textarea
              minLength={10}
              maxLength={2000}
              value={state.description}
              onChange={(e) => {
                dispatch({
                  type: "SET_VALUE",
                  field: "description",
                  value: e.target.value,
                });
              }}
              name="description"
              id="description"
              required
            ></Textarea>
          </LabelInputBlock>
        </form>
        <SubmitButton onClick={onSubmit} formId={FORM_ID}>
          Опубликовать
        </SubmitButton>
      </div>
    </FlexContainer>
  );
}
