import type { PropsWithChildren } from "react";

export default function Header({children}: PropsWithChildren) {
  return <header className="header">{children}</header>
}