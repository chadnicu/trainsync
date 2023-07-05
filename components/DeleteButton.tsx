"use client";

import {
  deleteExercise,
  deleteSession,
  removeExerciseFromSession,
} from "@/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export function DeleteButton({
  id,
  table,
  sessionId,
}: {
  id: number;
  table: "exercises" | "sessions" | "exercise_session";
  sessionId?: number;
}) {
  const queryClient = useQueryClient();

  const action = async () => {
    if (table === "exercises") {
      await deleteExercise(id);
      queryClient.invalidateQueries(["exercises"]);
    } else if (table === "sessions") {
      await deleteSession(id);
      queryClient.invalidateQueries(["sessions"]);
      queryClient.invalidateQueries(["sessions-navbar"]);
    } else if (sessionId) {
      await removeExerciseFromSession(id, sessionId);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full">
        <Button variant="outline">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently the entry and
            remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={action}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
