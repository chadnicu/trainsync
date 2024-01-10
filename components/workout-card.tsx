import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import DeleteDialog from "./delete-dialog";
import ResponsiveFormDialog from "./responsive-form-dialog";
import { Button } from "./ui/button";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./loading-spinner";
import {
  WorkoutContext,
  useDeleteWorkoutMutation,
  useEditWorkoutMutation,
} from "@/app/workouts/helpers";
import { useQueryClient } from "@tanstack/react-query";
import EditWorkoutForm from "./edit-workout-form";

export default function WorkoutCard() {
  const queryClient = useQueryClient();

  const { mutate: deleteOptimistically } =
    useDeleteWorkoutMutation(queryClient);

  const { id, title, description, date, started, finished, comment } =
    useContext(WorkoutContext);

  const { mutate: editOptimistically, isPending: isEditing } =
    useEditWorkoutMutation(queryClient, id);

  const isOptimistic = id === 0;

  return (
    <Card
      className={cn("w-[330px] sm:w-[348px]", {
        "opacity-50 relative": isOptimistic,
      })}
    >
      <CardHeader>
        {/* add a popover for description maybe */}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{date}</CardDescription>
        {isOptimistic && (
          <LoadingSpinner className="absolute right-[12px] top-[6px] h-4 w-4" />
        )}
      </CardHeader>
      <CardContent>
        {started && <p>started: {started}</p>}
        {finished && <p>finished: {finished}</p>}
        {comment && <p>comment: {comment}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isOptimistic ? (
          <>
            <Button variant={"outline"}>Edit</Button>
            <Button variant={"destructive"}>Delete</Button>
          </>
        ) : (
          <>
            <ResponsiveFormDialog
              trigger={<Button variant={"outline"}>Edit</Button>}
              title="Edit workout"
              description="Make changes to your workout here. Click save when you're done."
            >
              <EditWorkoutForm
                mutate={editOptimistically}
                submitButtonText="Edit"
                isSubmitting={isEditing}
              />
            </ResponsiveFormDialog>
            <DeleteDialog action={() => deleteOptimistically(id)} />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
