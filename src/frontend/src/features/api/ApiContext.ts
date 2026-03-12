import { createContext } from "react";
import apiAdapter from "./ApiAdapter";

const ApiContext = createContext<{
  api?: typeof apiAdapter;
}>({ api: apiAdapter });
export default ApiContext;
