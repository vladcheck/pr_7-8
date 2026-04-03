import type { InputHTMLAttributes } from 'react';
import Input from './Input';

export default function TextInput({
	value,
	onChange,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return <Input {...props} type="text" value={value} onChange={onChange} />;
}
