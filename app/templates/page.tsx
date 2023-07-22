import Templates from "./Templates";
import TemplateForm from "@/components/TemplateForm";

export default async function Page() {
  return (
    <div className="grid gap-2 p-10 md:flex md:flex-row-reverse md:justify-between">
      <TemplateForm />
      <Templates />
    </div>
  );
}
