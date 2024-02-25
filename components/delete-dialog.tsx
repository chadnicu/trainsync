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
import { buttonVariants } from "./ui/button";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export default function DeleteDialog({
  action,
  customTrigger,
  ...props
}: {
  customTrigger?: ReactNode;
  action: () => void;
} & ComponentPropsWithoutRef<"button">) {
  return (
    <AlertDialog>
      {customTrigger ?? (
        <AlertDialogTrigger
          className={buttonVariants({ variant: "destructive" })}
          {...props}
        >
          Delete
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="max-w-[90vw] rounded-lg sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            entry and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={action}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
