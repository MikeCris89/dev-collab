import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { Trash2 } from "lucide-react";
import { createContext, useContext, useState } from "react";

interface ModalCtx {
	setShowModal: React.Dispatch<React.SetStateAction<ShowModal | null>>;
}

interface ShowModal {
	type: string;
	onConfirm: () => void;
}

export const DeleteModalContext = createContext<ModalCtx | undefined>(
	undefined
);

const ModalProvider = ({ children }: React.PropsWithChildren) => {
	const [showModal, setShowModal] = useState<ShowModal | null>(null);

	const closeModal = () => setShowModal(null);

	return (
		<DeleteModalContext.Provider
			value={{
				setShowModal,
			}}
		>
			{children}
			{showModal && (
				// <div
				// 	className="absolute inset-0 z-50 bg-black/70 flex justify-center items-center"
				// 	onClick={(e) => e.stopPropagation()}
				// 	data-modal="true"
				// >
				// 	<div
				// 		className=" flex flex-col gap-4 justify-center items-center border border-border-medium rounded-md h-fit w-fit sm:min-w-[500px] max-w-[80%] p-6 bg-bg-elevated"
				// 		onClick={(e) => e.stopPropagation()}
				// 		data-modal="true"
				// 	>
				<Modal>
					<div className="flex justify-center items-center gap-4 text-center">
						<Trash2 className="text-red-500" />
						<h2 className="">Delete {showModal.type}</h2>
					</div>
					<p className="text-balance">
						Are you sure you want to delete this {showModal.type.toLowerCase()}?
					</p>
					<p className="text-balance">This action cannot be undone.</p>
					<div className="flex gap-3 self-end mt-5">
						<Button
							onClick={() => {
								closeModal();
							}}
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								showModal.onConfirm();
								closeModal();
							}}
						>
							Confirm
						</Button>
					</div>
				</Modal>
				// 	</div>
				// </div>
			)}
		</DeleteModalContext.Provider>
	);
};

//top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]

export default ModalProvider;

export const useDeleteModal = () => {
	const ctx = useContext(DeleteModalContext);
	if (!ctx) throw new Error("useModal must be used within Modal Provider.");
	return ctx;
};
