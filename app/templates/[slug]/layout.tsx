import { capitalizeWords, getIdFromSlug } from "@/lib/utils";
import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug.split("-");
  const name = capitalizeWords(slug.toSpliced(slug.length - 1).join(" "));
  const id = getIdFromSlug(params.slug);

  return {
    title: `${name}`,
    description: `Template page of ${name} with id ${id}`,
  };
}

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return children;
}
