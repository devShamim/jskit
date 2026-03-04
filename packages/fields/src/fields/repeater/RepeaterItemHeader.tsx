import { Tooltip } from '@wordpress/components';
import { Icon, copy, dragHandle, trash } from '@wordpress/icons';
import clsx from 'clsx';
import { PrivateFields } from '..';
import {
	Action,
	ItemHeaderActions,
	ItemHeaderContent,
	SortButton,
} from './styles';
import { RepeaterItemHeaderProps } from './types';
import { getItemLabel } from './utils';

export function RepeaterItemHeader(props: RepeaterItemHeaderProps) {
	const {
		item,
		field,
		repeaterProps,
		quickFields,
		setAttributes,
		actionsComponent: ActionsComponent,
		onDuplicate,
		onRemove,
		onToggleCollapse,
		isDisabledRemove,
		isOverlay,
		dragAttributes,
		dragListeners,
	} = props;

	const isCompact = field?.uiStyle === 'compact';
	const showDefaultSelection = field?.enableDefaultSelection;
	const selectionType = field?.defaultSelectionType || 'radio';

	const handleDefaultSelectionChange = () => {
		if (isOverlay) return;

		const { attrKey, attributes } = repeaterProps;
		const allItems = attributes[attrKey] ?? [];

		if (selectionType === 'radio') {
			// For radio: uncheck all others, toggle current
			const updatedItems = allItems.map((it: any) => ({
				...it,
				is_default: it.id === item.id ? !item.is_default : false,
			}));
			repeaterProps.setAttributes({ [attrKey]: updatedItems });
		} else {
			// For checkbox: just toggle current item
			setAttributes({ is_default: !item.is_default });
		}
	};

	return (
		<ItemHeaderContent className="repeater-header-content">
			<div className="repeater-header-content__inner">
				{isCompact && showDefaultSelection && (
					<span
						className="repeater-default-selection"
						onClick={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<input
							type={selectionType === 'radio' ? 'radio' : 'checkbox'}
							checked={!!item.is_default}
							onChange={handleDefaultSelectionChange}
						/>
					</span>
				)}

				<span className="repeater-item-label">
					<SortButton
						{...(dragListeners || {})}
						{...(dragAttributes || {})}
						className="repeater-sort-button"
					>
						<Icon icon={dragHandle} />
					</SortButton>
					{!isCompact && getItemLabel(field, item) && (
						<span>{getItemLabel(field, item)}</span>
					)}
				</span>

				{isCompact && (
					<div
						className="repeater-compact-fields"
						onClick={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<input
							type="text"
							className="repeater-compact-input"
							value={item.label || ''}
							onChange={(e) =>
								setAttributes({ label: e.target.value })
							}
							placeholder="Label"
						/>
						{field?.enableNumericValues && (
							<input
								type="number"
								className="repeater-compact-input repeater-compact-input-numeric"
								value={item.numeric_value ?? ''}
								onChange={(e) =>
									setAttributes({
										numeric_value: Number(e.target.value) < 0 ? 0 : Number(e.target.value),
									})
								}
								placeholder="Value"
								min={0}
							/>
						)}
					</div>
				)}

				{!isCompact && quickFields && (
					<div
						onClick={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
						style={{ display: 'contents' }}
					>
						<PrivateFields
							{...repeaterProps}
							attributes={item}
							setAttributes={setAttributes}
							fields={quickFields}
						/>
					</div>
				)}

				{ActionsComponent && (
					<ItemHeaderActions className="header-actions">
						<Action
							className="edit"
							onClick={(e: any) => e.stopPropagation()}
						>
							<ActionsComponent
								onDuplicate={
									isOverlay
										? () => { }
										: (id: number) => onDuplicate?.(id)
								}
								onRemove={
									isOverlay
										? () => { }
										: (id: number) => onRemove?.(id)
								}
								onToggleCollapse={
									isOverlay
										? () => { }
										: (id: number) =>
											onToggleCollapse?.(id)
								}
								item={item}
							/>
						</Action>
					</ItemHeaderActions>
				)}

				{!field?.fixed && !ActionsComponent && (
					<ItemHeaderActions className="header-actions">
						{(undefined === field?.allowDuplication ||
							field.allowDuplication) && (
								<Action
									onClick={(event: any) => {
										event.stopPropagation();
										if (!isOverlay) onDuplicate?.(item.id);
									}}
									className="copy"
								>
									<Icon icon={copy} />
								</Action>
							)}
						<Tooltip
							text={
								field?.showActionTooltip && !isDisabledRemove
									? 'Delete Item'
									: ''
							}
							delay={0}
							placement="bottom-end"
							className="tooltip-bottom-end"
						>
							<Action
								onClick={(event: any) => {
									event.stopPropagation();
									if (!isOverlay && !isDisabledRemove)
										onRemove?.(item.id);
								}}
								className={clsx('remove', {
									disabled: isDisabledRemove,
								})}
							>
								<Icon icon={trash} />
							</Action>
						</Tooltip>
					</ItemHeaderActions>
				)}
			</div>
		</ItemHeaderContent>
	);
}
