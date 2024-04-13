import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TrainSync • Exercises",
  description: "Exercises page of the free web-based workout tracker",
};

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return children;
}
