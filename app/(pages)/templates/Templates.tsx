"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Template } from "@/lib/types";
import TemplateCard from "@/components/TemplateCard";

export default function Templates() {
  const queryClient = useQueryClient();

  function queryTemplates() {
    const data = queryClient.getQueryData(["templates"]);
    if (!data) return [];
    return data as Template[];
  }

  const { data } = useQuery({
    queryKey: ["templates"],
    queryFn: queryTemplates,
    initialData: () => queryTemplates(),
  });

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data.length && <p>you have no templates</p>}
      {data.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
