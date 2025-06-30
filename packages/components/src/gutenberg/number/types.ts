import { LabelPosition } from '@wordpress/components/build-types/input-control/types';

export type NumberFieldType = {
	label: string;
	precision?: boolean;
	min?: number;
	max?: number;
	value: any;
	onChange: any;
	description?: string;
	disabled?: boolean;
	className?: string;
	required?: boolean;
	labelPosition?: LabelPosition;
};
