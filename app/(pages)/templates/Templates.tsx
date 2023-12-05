"use client";

import TemplateCard from "@/components/TemplateCard";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/lib/types";
import { getTemplates } from "@/app/(pages)/actions";

export default function Templates({ templates }: { templates: Template[] }) {
  const { data } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => getTemplates(),
    initialData: templates,
  });

  return (
    <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data.length && <p>you have no templates</p>}
      {data.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
