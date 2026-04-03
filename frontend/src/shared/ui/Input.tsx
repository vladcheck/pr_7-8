import type { InputHTMLAttributes } from 'react';
import cn from '@/shared/utils/cn';
import InputWrapper from './InputWrapper';

export default function Input({
	value,
	onChange,
	type = 'text',
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<InputWrapper>
			<input
				type={type}
				value={value}
				onChange={onChange}
				className={cn(
					'input-field block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all',
					className,
				)}
				{...props}
			/>
		</InputWrapper>
	);
}
