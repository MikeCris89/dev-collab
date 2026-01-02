import { useMemo } from "react";
import Checkbox, { type CheckItem } from "./Checkbox";

const CheckboxContainer = ({
	items,
	state,
	setState,
	noneLabel,
	icon,
	initial,
}: {
	items: CheckItem[];
	state: string[];
	setState: React.Dispatch<React.SetStateAction<string[]>>;
	noneLabel: string;
	icon?: React.ReactNode;
	initial?: string[];
}) => {
	const itemIds = useMemo(() => items.map((i) => i.id), [items]);

	const selectAll = useMemo(() => {
		if (itemIds.length === 0 || itemIds.length !== state.length) return false;

		const stateSet = new Set(state);
		return itemIds.every((id) => stateSet.has(id));
	}, [itemIds, state]);

	// No need for useState + useEffect!

	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked;
		if (checked) setState([...itemIds]);
		else setState([]);
	};

	return (
		<div className="flex flex-col items-stretch justify-center rounded-md outline outline-border-medium p-2 w-[300px] max-w-[95%] max-h-[700px] overflow-y-auto overflow-x-hiden">
			{/* <InputWrapper
				htmlFor="selectAll"
				label="select all"
				className="flex-row gap-2 p-1 pb-3 items-center"
				labelClassName="text-sm text-text-muted cursor-pointer p-2"
			> */}
			<div className="flex justify-between w-full items-cente p-1 mb-2">
				{initial ? (
					<p
						className="text-sm text-text-muted w-fit cursor-pointer"
						onClick={() => setState([...initial])}
					>
						reset
					</p>
				) : (
					<div></div>
				)}
				<label
					htmlFor="selectAll"
					className="flex flex-row gap-2 items-center cursor-pointer w-fit self-end"
				>
					<small>select all</small>
					<input
						type="checkbox"
						name="selectAll"
						id="selectAll"
						onChange={handleSelectAll}
						className="w-[10px] h-[10px]"
						checked={selectAll}
					/>
				</label>
			</div>
			{/* </InputWrapper> */}
			{items && items.length > 0 ? (
				items.map((item) => {
					const checked = state.includes(item.id);
					const onChange = (checked: boolean) => {
						if (checked) setState((prev) => [...prev, item.id]);
						else setState((prev) => prev.filter((i) => i !== item.id));
					};

					return (
						<Checkbox
							item={item}
							icon={icon}
							checked={checked}
							onChange={onChange}
							key={item.id}
						/>
					);
				})
			) : (
				<p className="text-text-muted text-sm self-center"> - {noneLabel} - </p>
			)}
		</div>
	);
};

export default CheckboxContainer;
