"use client";

import { addExerciseToSession } from "@/app/actions";
import { Button } from "./ui/button";

export default function AddButton({ ex, sesh }: { ex: number; sesh: number }) {
  return (
    <Button onClick={() => addExerciseToSession(ex, sesh)}>Add</Button>
  );
}
