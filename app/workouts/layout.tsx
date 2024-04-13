import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "TrainSync • Workouts",
  description: "Workouts page of the free web-based workout tracker",
};

export default function WorkoutsLayout({ children }: { children: ReactNode }) {
  return children;
}
