import FolderForm from "./FolderForm";
import NoteForm from "./NoteForm";
import ProjectForm from "./ProjectForm";
import UserEditForm from "./UserEditForm";
import useGetSearchParams from "@/hooks/useGetSearchParams";

const formReg = {
	// "user-add-form": UserAddForm,
	"user-edit-form": UserEditForm,
	"project-form": ProjectForm,
	"folder-form": FolderForm,
	"note-form": NoteForm,
};

type FormId = keyof typeof formReg;

const FormRenderer = () => {
	const [formId] = useGetSearchParams(["formId"]);

	if (!formId || !formReg[formId as FormId])
		throw new Error(`FormId mismatch: ${formId}`);

	const FormComponent = formReg[formId as FormId];

	return <FormComponent />;
};

export default FormRenderer;
