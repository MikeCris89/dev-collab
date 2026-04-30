import { useMemo } from "react";
import Checkbox, { type CheckItem } from "./Checkbox";
import { RotateCcw } from "lucide-react";

const CheckboxContainer = ({
	items,
	state,
	setState,
	noneLabel,
	icon,
	avatarIcon,
	initial,
}: {
	items: CheckItem[];
	state: string[];
	setState: React.Dispatch<React.SetStateAction<string[]>>;
	noneLabel: string;
	icon?: React.ReactNode;
	avatarIcon?: boolean;
	initial?: string[];
}) => {
	const itemIds = useMemo(() => items.map((i) => i.id), [items]);

	const selectAll = useMemo(() => {
		if (itemIds.length === 0 || itemIds.length !== state.length) return false;
		const stateSet = new Set(state);
		return itemIds.every((id) => stateSet.has(id));
	}, [itemIds, state]);

	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) setState([...itemIds]);
		else setState([]);
	};

	return (
		<div className="bg-bg-surface border border-border-light rounded-2xl overflow-hidden w-[300px] max-w-full">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light">
				{initial ? (
					<button
						type="button"
						onClick={() => setState([...initial])}
						className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
					>
						<RotateCcw size={11} />
						Reset
					</button>
				) : (
					<div />
				)}
				<label className="flex items-center gap-2 cursor-pointer">
					<span className="text-xs text-text-muted">Select all</span>
					<div className="relative">
						<input
							type="checkbox"
							name="selectAll"
							id="selectAll"
							onChange={handleSelectAll}
							checked={selectAll}
							className="hidden peer"
						/>
						<div className="w-4 h-4 rounded border border-border-medium peer-checked:bg-accent peer-checked:border-accent flex items-center justify-center transition-colors">
							{selectAll && (
								<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
									<path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							)}
						</div>
					</div>
				</label>
			</div>

			{/* Items */}
			<div className="max-h-[280px] overflow-y-auto">
				{items.length > 0 ? (
					items.map((item) => {
						const checked = state.includes(item.id);
						const onChange = (checked: boolean) => {
							if (checked) setState((prev) => [...prev, item.id]);
							else setState((prev) => prev.filter((i) => i !== item.id));
						};
						return (
							<Checkbox
								key={item.id}
								item={item}
								icon={icon}
								avatarIcon={avatarIcon}
								checked={checked}
								onChange={onChange}
							/>
						);
					})
				) : (
					<p className="text-text-muted text-sm text-center py-6">— {noneLabel} —</p>
				)}
			</div>
		</div>
	);
};

export default CheckboxContainer;
