import LoadingSpinner from "./LoadingSpinner";

const Loading = () => {
	return (
		<div className="flex justify-center items-center h-full w-full">
			<div className="flex flex-col gap-4 ">
				<LoadingSpinner size={32} />
				<p className="font-retro text-accent text-2xl">Loading...</p>
			</div>
		</div>
	);
};

export default Loading;
