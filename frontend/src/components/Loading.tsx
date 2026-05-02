import LoadingSpinner from "./LoadingSpinner";

const Loading = ({ withText = false }: { withText?: boolean }) => {
	return (
		<div className="flex justify-center items-center h-full w-full">
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
