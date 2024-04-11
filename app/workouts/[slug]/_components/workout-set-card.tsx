import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import SetForm from "./set-form";
import { Set } from "@/types";
import { useDeleteSet, useUpdateSet } from "@/hooks/tanstack/sets";

// testeaza tot cand poti
export default function WorkoutSetCard({ set }: { set: Set }) {
  const { mutate: updateSet, isPending: isEditing } = useUpdateSet();
  const { mutate: deleteSet, isPending: isDeleting } = useDeleteSet();

  const isOptimistic = set.id === 0;
  const BoldNumber = ({ n }: { n: number | null }) => (
    <span className="text-xl font-semibold">{n}</span>
  );

  return (
    <ResponsiveFormDialog
      trigger={
        <button
          className={cn("flex items-center gap-3 mx-auto px-3 py-1", {
            "opacity-60": isOptimistic,
          })}
          disabled={isOptimistic || isEditing}
        >
          <BoldNumber n={set.reps} />
          <Cross2Icon />
          <BoldNumber n={set.weight} />
        </button>
      }
      title={"Edit set"}
      description={"Edit or delete this set"}
      drawerContentClassname="max-h-[276px]"
    >
      <SetForm
        submitAction={(values) => updateSet({ ...values, id: set.id })}
        deleteSet={() => deleteSet(set.id)}
        isDeleting={isDeleting}
        isSubmitting={isEditing}
        submitButtonText="Edit"
        defaultValues={{ reps: set.reps ?? 0, weight: set.weight ?? 0 }}
      />
    </ResponsiveFormDialog>
  );
}
