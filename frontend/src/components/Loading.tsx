import LoadingSpinner from "./LoadingSpinner";

const Loading = () => {
	return (
		<div className="flex justify-center items-center h-full w-full">
			<div className="flex flex-col gap-4 ">
				<LoadingSpinner size={32} />
				<p>Loading...</p>
			</div>
		</div>
	);
};

export default Loading;
