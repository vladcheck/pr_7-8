import { useState, type PropsWithChildren } from "react";
import apiAdapter from "./ApiAdapter";
import ApiContext from "./ApiContext";

export default function ApiWrapper({ children }: PropsWithChildren) {
  const [api] = useState(apiAdapter);

  return <ApiContext value={{ api }}>{children}</ApiContext>;
}
