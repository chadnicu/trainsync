import { Suspense } from "react";
import Template from "./Template";
import {
  getCurrentTemplate,
  getExercisesByTemplateId,
} from "@/app/(pages)/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: { params: { id: string } }) {
  const fallback = (
    <>
      <div className="grid gap-2">
        <h1 className="text-5xl font-bold">Loading...</h1>
        <p className="text-sm">Hold up</p>
      </div>
      <div className="flex items-center justify-center">
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <div className="flex flex-col items-center gap-5 px-5 md:justify-around">
        <div className="grid gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <Card key={i} className="flex w-[90vw] justify-between md:w-[40vw]">
              <CardHeader className="w-full pr-2">
                <Skeleton className="h-10 w-full" />
              </CardHeader>
              <CardContent className="flex items-center justify-center py-0 pl-2">
                <Skeleton className="h-10 w-[75px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>
    </>
  );

  return (
    <Suspense fallback={fallback}>
      {fallback}
      {/* <FetchTemplate id={params.id} /> */}
    </Suspense>
  );
}

async function FetchTemplate({ id }: { id: string }) {
  const templateId = parseInt(id, 10);

  const [template, { templatesExercises, otherExercises }] = await Promise.all([
    getCurrentTemplate(templateId),
    getExercisesByTemplateId(templateId),
  ]);

  return (
    <Template
      template={template}
      templatesExercises={templatesExercises}
      otherExercises={otherExercises}
    />
  );
}
