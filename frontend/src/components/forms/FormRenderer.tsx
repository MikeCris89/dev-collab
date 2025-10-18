import { useParams, useSearchParams } from "react-router-dom";
import FolderForm from "./FolderForm";
import NoteForm from "./NoteForm";
import ProjectForm from "./ProjectForm";
import UserAddForm from "./UserAddForm";
import UserEditForm from "./UserEditForm";

const formReg = {
	"user-add-form": UserAddForm,
	"user-edit-form": UserEditForm,
	"project-form": ProjectForm,
	"folder-form": FolderForm,
	"note-form": NoteForm,
};

type FormId = keyof typeof formReg;

const FormRenderer = () => {
	const { projectId } = useParams();
	const [searchParams] = useSearchParams();

	const formId = searchParams.get("formId") as FormId | null;
	console.log("form renderer project id", projectId);
	if (!formId || !formReg[formId]) throw new Error();

	const FormComponent = formReg[formId];

	return (
		<div>
			<FormComponent />
		</div>
	);
};

export default FormRenderer;
