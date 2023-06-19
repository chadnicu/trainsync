"use client";

import { removeExerciseFromSession } from "@/app/actions";
import { Button } from "./ui/button";

export default function RemoveButton({ ex, sesh }: { ex: number; sesh: number }) {
  return (
    <Button onClick={() => removeExerciseFromSession(ex, sesh)}>Remove</Button>
  );
}
