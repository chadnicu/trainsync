import Templates from "./Templates";
import TemplateForm from "@/components/TemplateForm";
import TemplateSkeleton from "@/components/TemplateSkeleton";
import { Suspense } from "react";
import { getTemplates } from "@/app/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates",
};

export default async function Page() {
  const fallback = (
    <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }, (_, i) => (
        <TemplateSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Templates</h1>
      <div className="grid place-items-center gap-10 md:flex md:flex-row-reverse md:place-items-start md:justify-between">
        <TemplateForm />
        <Suspense fallback={fallback}>
          <FetchTemplates />
        </Suspense>
      </div>
    </>
  );
}

async function FetchTemplates() {
  const templates = await getTemplates();
  return <Templates templates={templates} />;
}
