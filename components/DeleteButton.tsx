"use client";

import { removeExerciseFromSession } from "@/app/actions";
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
  mutate,
  fromServer,
}: {
  mutate?: () => void;
  fromServer?: { exerciseId: number; sessionId: number };
}) {
  // const action = async () => {
  //   if (table === "exercises") {
  //     await deleteExercise(id);
  //     queryClient.invalidateQueries(["exercises"]);
  //   } else if (table === "sessions") {
  //     await deleteSession(id);
  //     queryClient.invalidateQueries(["sessions"]);
  //     queryClient.invalidateQueries(["sessions-navbar"]);
  //   } else if (sessionId) {
  //     await removeExerciseFromSession(id, sessionId);
  //   }
  // };

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
          <AlertDialogAction
            onClick={
              !mutate && fromServer
                ? async () =>
                    await removeExerciseFromSession(
                      fromServer.exerciseId,
                      fromServer.sessionId
                    )
                : mutate
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
