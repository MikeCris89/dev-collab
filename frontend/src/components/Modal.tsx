import type { PropsWithChildren } from "react";

const Modal = ({ children }: PropsWithChildren) => {
	return (
		<div
			className="absolute inset-0 z-50 bg-black/70 flex justify-center items-center"
			onClick={(e) => e.stopPropagation()}
			data-modal="true"
		>
			<div
				className=" flex flex-col gap-4 justify-center items-center border border-border-medium rounded-md h-fit w-fit sm:min-w-[500px] max-w-[80%] p-6 bg-bg-elevated"
				onClick={(e) => e.stopPropagation()}
				data-modal="true"
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;
