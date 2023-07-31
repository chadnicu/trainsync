import Template from "./Template";
import { getCurrentTemplate, getExercisesByTemplateId } from "@/app/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const templateId = parseInt(params.id, 10);
  const template = await getCurrentTemplate(templateId);
  const { templatesExercises, otherExercises } = await getExercisesByTemplateId(
    templateId
  );

  return (
    <Template
      template={template}
      templatesExercises={templatesExercises}
      otherExercises={otherExercises}
    />
  );
}
