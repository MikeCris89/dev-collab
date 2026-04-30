import clsx from "clsx";
import { Check } from "lucide-react";
import Avatar from "../Avatar";

export interface CheckItem {
	label: string;
	fieldName?: string;
	id: string;
}

const Checkbox = ({
	item,
	checked,
	onChange,
	icon,
	avatarIcon,
}: {
	item: CheckItem;
	checked: boolean;
	onChange: (checked: boolean) => void;
	icon?: React.ReactNode;
	avatarIcon?: boolean;
}) => {
	const { id, label } = item;

	return (
		<label
			key={id}
			className={clsx(
				"flex gap-3 items-center w-full px-4 py-3 cursor-pointer transition-colors border-b border-border-light last:border-b-0",
				checked ? "bg-accent/5" : "hover:bg-accent/5",
			)}
		>
			{avatarIcon ? (
				<Avatar name={label} size="sm" />
			) : icon ? (
				<i className={clsx("shrink-0", checked ? "text-accent" : "text-text-muted")}>
					{icon}
				</i>
			) : null}

			<span className="flex-1 text-sm truncate">{label}</span>

			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="hidden"
			/>
			<div
				className={clsx(
					"w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors",
					checked
						? "bg-accent border-accent"
						: "border-border-medium bg-transparent",
				)}
			>
				{checked && <Check size={10} className="text-white stroke-[3]" />}
			</div>
		</label>
	);
};

export default Checkbox;
