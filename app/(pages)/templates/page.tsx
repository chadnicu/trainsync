import Templates from "./Templates";
import TemplateForm from "@/components/TemplateForm";

export default async function Page() {
  return (
    <>
      <h1 className="text-center text-5xl font-bold">Templates</h1>
      <div className="grid gap-5 md:flex md:flex-row-reverse md:justify-between">
        <div className="flex flex-col gap-2">
          <TemplateForm />
        </div>
        <Templates />
      </div>
    </>
  );
}
