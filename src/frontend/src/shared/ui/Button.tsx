import { MouseEvent, PropsWithChildren } from "react";
import cn from "../utils/cn";

export default function Button({
  onClick,
  children,
  className,
}: PropsWithChildren & {
  className?: string;
  onClick?: (e?: MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2 py-0.5 bg-gray-400 rounded-md hover:bg-amber-500",
        className,
      )}
    >
      {children}
    </button>
  );
}
