const LoadingSpinner = ({ size = 24 }: { size?: number }) => (
	<div
		style={{ width: size, height: size }}
		className="border-2 border-current border-t-transparent rounded-full animate-spin m-auto"
	/>
);

export default LoadingSpinner;
