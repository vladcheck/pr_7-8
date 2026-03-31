import { useState, type PropsWithChildren } from "react";
import apiFacade from "./ApiFacade";
import ApiContext from "./ApiContext";

export default function ApiWrapper({ children }: PropsWithChildren) {
  const [api] = useState(apiFacade);

  return <ApiContext value={{ api }}>{children}</ApiContext>;
}
