import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cn from '@/shared/utils/cn';

export default function SubmitButton({
	formId,
	onClick,
	children,
	className,
	...props
}: PropsWithChildren &
	ButtonHTMLAttributes<HTMLButtonElement> & {
		formId: string;
	}) {
	return (
		<button
			type="submit"
			form={formId}
			onClick={(e) => {
				e.preventDefault();
				onClick?.(e);
			}}
			className={cn(
				'transition-colors duration-150 bg-gray-900 text-white px-4 py-1 rounded-xl hover:bg-gray-800',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
