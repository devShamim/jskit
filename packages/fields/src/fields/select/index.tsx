/**
 * External dependencies
 */
import { isFunction } from 'lodash';
import { Select as SelectComponent } from '@shamim-ahmed/components';

/**
 * Internal dependencies
 */
import Label from '../../components/label';
import { getValue, isDisabled, updateAttribute } from '../../utils';
import { StyledHelpText, StyledLabel, Wrapper } from './styles';
import { SelectFieldProps } from './types';

export default function Select( props: SelectFieldProps ) {
	// The components package is built/published separately; widen typing here
	// so fields can pass newer react-select props (like `isClearable`).
	const SelectComponentAny = SelectComponent as any;

	const { field, attributes } = props;
	const { options, description, label, optionsApi, onFetchSuccess } =
		field || {};
	const isMulti = props.isMulti ?? field?.isMulti ?? false;
	const isClearable = props.isClearable ?? field?.isClearable;
	const normalizedOptions = isFunction( options )
		? options( attributes )
		: options || [];

	const value = getValue( props );

	return (
		<div className="components-base-control">
			<Wrapper className="components-base-field">
				{ label && (
					<StyledLabel className="components-base-control__label">
						{ /* @ts-ignore */ }
						<Label { ...props } />
					</StyledLabel>
				) }

				<SelectComponentAny
					value={ value }
					options={ normalizedOptions }
					onChange={ ( value: any ) =>
						updateAttribute( value, props )
					}
					className={ field?.className }
					classNamePrefix={ field?.classNamePrefix }
					isDisabled={ isDisabled( props ) }
					isMulti={ isMulti }
					isClearable={ isClearable }
					menuPosition={ field?.menuPosition }
					optionsApi={
						isFunction( optionsApi )
							? optionsApi( attributes )
							: optionsApi
					}
					onFetchSuccess={ onFetchSuccess }
					styles={ field?.styles }
				/>
			</Wrapper>

			{ description && (
				<StyledHelpText className="components-base-control__help">
					{ description }
				</StyledHelpText>
			) }
		</div>
	);
}
