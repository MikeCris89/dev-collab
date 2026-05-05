import FolderForm from "./FolderForm";
import NoteForm from "./NoteForm";
import ProjectForm from "./ProjectForm";
import UserEditForm from "./UserEditForm";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import UserAddForm from "./UserAddForm";
import RequireAdmin from "../RequireAdmin";

const formReg = {
	"user-add-form": { Component: UserAddForm, adminOnly: true },
	"user-edit-form": { Component: UserEditForm, adminOnly: true },
	"project-form": { Component: ProjectForm, adminOnly: true },
	"folder-form": { Component: FolderForm, adminOnly: true },
	"note-form": { Component: NoteForm, adminOnly: false },
};

type FormId = keyof typeof formReg;

const FormRenderer = () => {
	const [formId] = useGetSearchParams(["formId"]);

	if (!formId || !formReg[formId as FormId])
		throw new Error(`FormId mismatch: ${formId}`);

	const { Component, adminOnly } = formReg[formId as FormId];

	return adminOnly ? (
		<RequireAdmin>
			<Component />
		</RequireAdmin>
	) : (
		<Component />
	);
};

export default FormRenderer;
