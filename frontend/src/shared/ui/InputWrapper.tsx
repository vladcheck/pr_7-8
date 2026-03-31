import type { PropsWithChildren } from "react";

export default function InputWrapper({ children }: PropsWithChildren) {
  return <div className="input-wrapper relative">{children}</div>;
}
