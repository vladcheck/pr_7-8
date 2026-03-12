import type { BaseHTMLAttributes, ChangeEvent } from "react";
import Input from "./Input";

export default function TextInput({
  value,
  onChange,
  ...props
}: {
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
} & BaseHTMLAttributes<HTMLInputElement>) {
  return <Input {...props} type="text" value={value} onChange={onChange} />;
}
