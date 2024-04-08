"use client";

import { H1, P } from "@/components/typography";
import { useTemplate } from "@/hooks/tanstack/templates";
import LoadingTemplate from "./loading-to-do";
import {
  TemplateExerciseContext,
  useAddExerciseToTemplate,
  useTemplateExercises,
} from "@/hooks/tanstack/template-exercise";
import TemplateExerciseCard from "./_components/template-exercise-card";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import EditTemplateExercises from "./_components/edit-template-exercises";
import { ResponsiveComboBox } from "@/components/responsive-combobox";

type Params = {
  params: { slug: string };
};

export default function Template({ params: { slug } }: Params) {
  const { data: template, isSuccess, isFetching, isLoading } = useTemplate();
  const {
    data: { inTemplate, other },
  } = useTemplateExercises();

  const { mutate: addExerciseToTemplate, isPending: isAdding } =
    useAddExerciseToTemplate();

  if ((isFetching || isLoading) && !template?.title) return <LoadingTemplate />;

  const TemplateExercises = () => {
    return inTemplate.map((e) => (
      <TemplateExerciseContext.Provider key={e.id} value={e}>
        <TemplateExerciseCard />
      </TemplateExerciseContext.Provider>
    ));
  };

  return (
    <section className="sm:container text-center space-y-4">
      {isSuccess && (
        <>
          <H1 className="py-1">{template.title}</H1>
          {template.description && (
            <P className="max-w-lg mx-auto">{template.description}</P>
          )}
        </>
      )}

      <TemplateExercises />

      <div className="flex flex-col gap-2 min-[370px]:flex-row w-fit mx-auto">
        <ResponsiveFormDialog
          trigger={
            inTemplate.length > 1 && (
              <Button variant={"outline"}>Edit exercise order</Button>
            )
          }
          title="Edit exercise order"
          description="Simply click on the exercises to number them in order"
        >
          <EditTemplateExercises exercises={inTemplate} />
        </ResponsiveFormDialog>
        <ResponsiveComboBox
          trigger={
            <Button variant="outline">
              Add {inTemplate.length > 0 ? "another" : "an"} exercise
            </Button>
          }
          data={other.map(({ id, title }) => ({
            id,
            title,
          }))}
          placeholder="Search exercise.."
          mutate={({ exerciseId }) =>
            addExerciseToTemplate({
              exerciseId,
              order:
                inTemplate.length > 0
                  ? inTemplate[inTemplate.length - 1].order + 1
                  : 1,
            })
          }
        />
      </div>
    </section>
  );
}
