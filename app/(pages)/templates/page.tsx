import { Suspense } from "react";
import { getTemplates } from "../actions";
import Templates from "./Templates";
import TemplateForm from "@/components/TemplateForm";

export default async function Page() {
  const fallback = <p>ADD TEMPLATE SKELETON CARDS</p>;

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
