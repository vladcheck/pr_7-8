import type { MouseEvent, PropsWithChildren } from 'react';
import cn from '@/shared/utils/cn';

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
				'px-4 py-2 font-medium text-white transition-all transform rounded-xl select-none',
				'bg-surface-hover border border-border-color shadow hover:bg-surface text-text-color',
				'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
				className,
			)}
		>
			{children}
		</button>
	);
}
