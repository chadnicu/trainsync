import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { WorkoutExercise } from "../_utils/types";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateExerciseOrder } from "../_utils/hooks";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";
import { ToggleDialogFunction } from "@/components/responsive-form-dialog";

export default function EditWorkoutExercises({
  exercises,
}: {
  exercises: WorkoutExercise[];
}) {
  const [order, setOrder] = useState<number[]>([]);

  const getIndex = (arr: number[], id: number) =>
    arr.findIndex((e) => e === id);

  const queryClient = useQueryClient();

  const { mutate: updateExerciseOrder, isPending } = useUpdateExerciseOrder(
    queryClient,
    exercises[0]?.workout_id ?? -1
  );

  return (
    <>
      <div className="space-y-2">
        {exercises.map((e) => (
          <Card
            key={e.id}
            className="flex justify-between items-center p-4 duration-200 hover:brightness-[2]"
            onClick={() =>
              setOrder((old) =>
                getIndex(old, e.id) === -1
                  ? [...old, e.id]
                  : old.filter((el) => el !== e.id)
              )
            }
          >
            <CardTitle>{e.title}</CardTitle>
            <CardContent className="p-0">
              {getIndex(order, e.id) !== -1 ? (
                <p className="font-bold text-background h-7 w-7 rounded-full flex items-center justify-center bg-foreground">
                  {getIndex(order, e.id) + 1}
                </p>
              ) : (
                <p className="border-2 border-foreground h-7 w-7 rounded-full flex items-center justify-center" />
              )}
              {/* <Button variant="ghost" className="h-6 p-0 w-6">
                <TrashIcon />
              </Button> */}
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        className="ml-auto w-fit"
        disabled={order.length !== exercises.length || exercises.length < 2}
        onClick={() => {
          updateExerciseOrder(order);
        }}
      >
        Save
        {isPending && (
          <LoadingSpinner className="ml-1 w-4 h-4 text-background/80 fill-background/80" />
        )}
      </Button>
    </>
  );
}
