import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import cn from '@/shared/utils/cn';
import InputWrapper from './InputWrapper';

interface NumberInputProps {
	min?: number;
	max?: number;
}

export default function Input({
	value,
	onChange,
	type = 'text',
	className,
	...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
	Partial<NumberInputProps>) {
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
