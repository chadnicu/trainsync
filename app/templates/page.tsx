"use client";

import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { H1, P } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  TemplateContext,
  useCreateTemplate,
  useTemplates,
} from "@/hooks/tanstack/templates";
import { queryKeys } from "@/hooks/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import TemplateCard from "./_components/template-card";
import TemplateForm from "./_components/template-form";
import TemplateSkeleton from "./_components/template-skeleton";
import LoadingTemplates from "./loading";

export default function Templates() {
  const {
    data: templates,
    isError,
    isFetching,
    isLoading,
    isSuccess,
  } = useTemplates();

  const { mutate: createTemplate, isPending } = useCreateTemplate();

  const queryClient = useQueryClient();
  const Error = () => (
    <P className="grid place-items-center gap-3">
      Something went wrong.
      <Button
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: queryKeys.templates })
        }
        className="w-fit"
      >
        Refresh
      </Button>
    </P>
  );

  const Skeletons = () =>
    Array.from({ length: 6 }, (_, i) => <TemplateSkeleton key={i} />);

  const Templates = () =>
    templates.map((e) => (
      <TemplateContext.Provider key={e.id} value={e}>
        <TemplateCard />
      </TemplateContext.Provider>
    ));

  return (
    <section className="space-y-10">
      <H1 className="text-center">Your templates</H1>
      {isError && <Error />}
      <ResponsiveFormDialog
        trigger={
          <Button className="block ml-auto sm:float-right">Create</Button>
        }
        title="Create template"
        description="Description field isn't mandatory."
      >
        <TemplateForm
          mutate={createTemplate}
          isSubmitting={isPending}
          submitButtonText="Create"
        />
      </ResponsiveFormDialog>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 place-items-center gap-y-5">
        {(isFetching || isLoading) && !templates.length && <Skeletons />}
        {isSuccess && <Templates />}
      </div>
    </section>
  );
}
