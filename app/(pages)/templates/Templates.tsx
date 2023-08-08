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
    <div>
      {!data?.length && <p>you have no templates</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {data?.map((template) => (
          <TemplateCard key={template.id} template={template}></TemplateCard>
        ))}
      </div>
    </div>
  );
}
