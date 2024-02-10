import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import { WorkoutSet } from "../_utils/types";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import EditSetForm from "./set-form";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteSet, useEditSet } from "../_utils/hooks";

export default function WorkoutSetCard({ set }: { set: WorkoutSet }) {
  const isOptimistic = set.id === 0;

  const BoldNumber = ({ n }: { n: number | null }) => (
    <span className="text-xl font-semibold">{n}</span>
  );

  const queryClient = useQueryClient();
  const { mutate: editSet, isPending: isEditing } = useEditSet(
    queryClient,
    set.id
  );
  const { mutate: deleteSet, isPending: isDeleting } = useDeleteSet(
    queryClient,
    set.id
  );

  return (
    <ResponsiveFormDialog
      trigger={
        <button
          className={cn("flex items-center gap-3 mx-auto px-3 py-1", {
            "opacity-60": isOptimistic,
          })}
          onClick={() => {}}
        >
          <BoldNumber n={set.reps} />
          <Cross2Icon />
          <BoldNumber n={set.weight} />
        </button>
      }
      title={"Edit set"}
      description={"Edit or delete this set"}
    >
      <EditSetForm
        submitAction={editSet}
        deleteSet={deleteSet}
        isDeleting={isDeleting}
        isSubmitting={isEditing}
        submitButtonText="Edit"
        defaultValues={{ reps: set.reps ?? 0, weight: set.weight ?? 0 }}
      />
    </ResponsiveFormDialog>
  );
}
