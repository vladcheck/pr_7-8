import { MouseEvent, PropsWithChildren } from "react";
import cn from "@/shared/utils/cn";

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
        "px-2 py-0.5 bg-gray-200 rounded-md hover:border-amber-400 hover:bg-amber-200",
        className,
      )}
    >
      {children}
    </button>
  );
}
