import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug.split("-");
  const name = slug;
  // const name = capitalizeWords(slug.toSpliced(slug.length - 1).join(" "));
  // const id = getIdFromSlug(params.slug);

  return {
    title: `${name}`,
    description: `Exercise page of ${name} with id ${1}`,
  };
}

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
