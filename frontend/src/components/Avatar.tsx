import clsx from "clsx";

type AvatarSize = "sm" | "md" | "lg";

type Props = {
	name: string;
	size?: AvatarSize;
	className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
	sm: "w-8 h-8 text-sm",
	md: "w-10 h-10 text-base",
	lg: "w-16 h-16 text-2xl",
};

const Avatar = ({ name, size = "md", className }: Props) => {
	const initial = name.charAt(0).toUpperCase();
	return (
		<div
			className={clsx(
				"rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent select-none shrink-0",
				sizeClasses[size],
				className,
			)}
		>
			{initial}
		</div>
	);
};

export default Avatar;
