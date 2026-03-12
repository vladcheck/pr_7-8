import type {
  BaseHTMLAttributes,
  ChangeEvent,
  HTMLInputTypeAttribute,
} from "react";
import cn from "../utils/cn";
import InputWrapper from "./InputWrapper";

export default function Input({
  value,
  onChange,
  ...props
}: {
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  type: HTMLInputTypeAttribute;
} & BaseHTMLAttributes<HTMLInputElement>) {
  return (
    <InputWrapper>
      <input
        {...props}
        value={value}
        onChange={onChange}
        className={cn(
          "border border-black rounded-sm px-2 py-1",
          props.className,
        )}
      />
    </InputWrapper>
  );
}
