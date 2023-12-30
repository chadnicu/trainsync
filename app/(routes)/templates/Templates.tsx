"use client";

import TemplateCard from "@/components/TemplateCard";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "@/app/actions";
import TemplateSkeleton from "@/components/TemplateSkeleton";

export default function Templates() {
  const { data, isFetched } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => getTemplates(),
    initialData: [],
  });

  if (!isFetched)
    return (
      <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }, (_, i) => (
          <TemplateSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 place-items-center items-start gap-10 lg:grid-cols-2 xl:grid-cols-3">
      {!data.length && <p>you have no templates</p>}
      {data.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
