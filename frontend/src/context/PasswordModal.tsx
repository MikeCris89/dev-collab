import {
	createContext,
	useContext,
	useState,
	type PropsWithChildren,
} from "react";

interface ModalCtx {
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalCtx = createContext<ModalCtx | null>(null);

export const PasswordModalProvider = ({ children }: PropsWithChildren) => {
	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<ModalCtx.Provider value={{ showModal, setShowModal }}>
			{children}
			{showModal && <div></div>}
		</ModalCtx.Provider>
	);
};

export const usePasswordModal = () => {
	const ctx = useContext(ModalCtx);
	if (!ctx)
		throw new Error(
			"Form Modal Context must be use within provider component."
		);
	return ctx;
};
