import clsx from "clsx";
import { CheckCircleIcon, Circle } from "lucide-react";

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
}: {
	item: CheckItem;
	checked: boolean;
	onChange: (checked: boolean) => void;
	icon?: React.ReactNode;
}) => {
	const { id, label } = item;

	return (
		<label
			key={id}
			className={clsx(
				"flex gap-2 justify-start items-center w-full text-left p-2 border-b border-b-border-light cursor-pointer hover:bg-hover-light ",
				checked && "bg-hover-medium"
			)}
		>
			{icon && (
				<i
					className={clsx(
						"shrink-0 ",
						checked ? "text-accent" : "text-text-muted"
					)}
				>
					{icon}
				</i>
			)}
			<span className="line-clamp-2 text-ellipsis flex-1">{label}</span>
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="hidden peer"
			/>
			<i className="text-neutral-500 peer-checked:text-accent justify-self-end shrink-0">
				{checked ? <CheckCircleIcon /> : <Circle />}
			</i>
		</label>
	);
};

export default Checkbox;
