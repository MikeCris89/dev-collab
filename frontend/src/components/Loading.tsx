import clsx from "clsx";
import LoadingSpinner from "./LoadingSpinner";

const Loading = ({
	withText = false,
	className,
}: {
	withText?: boolean;
	className?: string;
}) => {
	return (
		<div
			className={clsx(
				"flex justify-center items-center h-full w-full",
				className,
			)}
		>
			<div className="flex flex-col gap-4 ">
				<LoadingSpinner size={32} />
				{withText && (
					<p className="font-retro text-accent text-2xl">Loading...</p>
				)}
			</div>
		</div>
	);
};

export default Loading;
