import { InputControlProps } from '@wordpress/components/build-types/input-control/types';

export type InputProps = Omit< InputControlProps, 'help' > & {
	disabled: boolean;
	description?: string;
};
