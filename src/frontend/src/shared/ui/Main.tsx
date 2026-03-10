import type { PropsWithChildren } from "react";

export default function Main({children}: PropsWithChildren) {
  return <main className="main">{children}</main>
}