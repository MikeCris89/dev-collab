import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import { Trash2 } from "lucide-react";
import { createContext, useContext, useState } from "react";

interface ModalCtx {
	setShowModal: React.Dispatch<React.SetStateAction<ShowModal | null>>;
}

interface ShowModal {
	type: string;
	onConfirm: () => void;
	msg?: string;
	err?: string | null;
	isLoading?: boolean;
}

export const DeleteModalContext = createContext<ModalCtx | undefined>(
	undefined,
);

const ModalProvider = ({ children }: React.PropsWithChildren) => {
	const [showModal, setShowModal] = useState<ShowModal | null>(null);

	const closeModal = () => setShowModal(null);
	const isProject = showModal?.type.toLowerCase() === "project";
	const isFolder = showModal?.type.toLowerCase() === "folder";

	return (
		<DeleteModalContext.Provider
			value={{
				setShowModal,
			}}
		>
			{children}
			{showModal && (
				<Modal>
					<div className="flex justify-center items-center gap-4 text-center">
						<Trash2 className="text-red-500" />
						<h2 className="">Delete {showModal.type}</h2>
					</div>
					<p className="text-balance">
						{showModal.msg ??
							`Are you sure you want to delete this ${showModal.type.toLowerCase()}
						${isProject || isFolder ? " and it's contents " : ""}?`}
					</p>
					<p className="text-balance">This action cannot be undone.</p>
					<div className="flex gap-3 self-end mt-5">
						<Button
							onClick={() => {
								closeModal();
							}}
							disabled={showModal.isLoading}
						>
							Cancel
						</Button>
						<Button
							variant="default"
							className="bg-red-500"
							onClick={() => {
								showModal.onConfirm();
								closeModal();
							}}
							disabled={showModal.isLoading}
						>
							{showModal.isLoading ? <LoadingSpinner /> : "Delete"}
						</Button>
					</div>
					{showModal.err && (
						<p className="text-sm text-red-500">{showModal.err}</p>
					)}
				</Modal>
			)}
		</DeleteModalContext.Provider>
	);
};

export default ModalProvider;

export const useDeleteModal = () => {
	const ctx = useContext(DeleteModalContext);
	if (!ctx) throw new Error("useModal must be used within Modal Provider.");
	return ctx;
};
