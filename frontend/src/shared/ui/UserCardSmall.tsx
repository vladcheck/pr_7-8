import type { User } from '@root-shared/types/User';
import { X } from 'lucide-react';
import Button from './Button';
import FlexContainer from './FlexContainer';

export default function UserCardSmall({
	onDeleteUser,
	...params
}: User & { onDeleteUser: (id: string) => void }) {
	return (
		<FlexContainer
			className="gap-2 border border-black pl-2 pr-2 pt-1 pb-1"
			justify="evenly"
			align="center"
		>
			<div>
				<Button
					onClick={() => {
						onDeleteUser(params.id);
					}}
				>
					<X />
				</Button>
			</div>
			<span>
				{params.firstName} {params.lastName}
			</span>
			<span>{params.email}</span>
		</FlexContainer>
	);
}
