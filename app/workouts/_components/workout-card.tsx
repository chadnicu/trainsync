import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeleteDialog from "@/components/delete-dialog";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { cn, slugify } from "@/lib/utils";
import LoadingSpinner from "@/components/loading-spinner";
import { useQueryClient } from "@tanstack/react-query";
import EditWorkoutForm from "./edit-workout-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "@/lib/dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { typography } from "@/components/typography";
import CommentAlert from "@/components/comment";
import { WorkoutContext } from "../_utils/context";
import { useDeleteWorkout, useEditWorkout } from "../_utils/hooks";
import { usePathname } from "next/navigation";

function getDiffInMinutes(started: string | null, finished: string | null) {
  if (
    !started ||
    !finished ||
    started.length !== 5 ||
    finished.length !== 5 ||
    started.indexOf(":") === -1 ||
    finished.indexOf(":") === -1
  )
    return -1;

  const [sHour, sMin] = started.split(":").map((e) => parseInt(e, 10));
  const [fHour, fMin] = finished.split(":").map((e) => parseInt(e, 10));
  const startTime = dayjs().hour(sHour).minute(sMin);
  const finishTime = dayjs().hour(fHour).minute(fMin);
  const duration = finishTime.diff(startTime, "minutes");

  return duration;
}

export default function WorkoutCard() {
  const queryClient = useQueryClient();

  const { mutate: deleteOptimistically } = useDeleteWorkout(queryClient);

  const { id, title, description, date, started, finished, comment } =
    useContext(WorkoutContext);

  const { mutate: editOptimistically, isPending: isEditing } = useEditWorkout(
    queryClient,
    id
  );

  const isOptimistic = id === 0;

  const dayJsDate = dayjs(date);
  const duration = getDiffInMinutes(started, finished);

  const formattedDate = dayJsDate.format("DD-MM-YYYY");
  const relativeDay = dayJsDate.isToday()
    ? "(today)"
    : `(${dayjs()
        .hour(Math.floor(duration / 60))
        .to(dayJsDate)})`;
  const formattedDuration =
    duration === -1 ? "" : `(${duration} minute${duration !== 1 ? "s" : ""})`;
  const formattedHours = `${started ? started : finished ? "unknown" : ""}${
    finished ? `-${finished}` : started ? "-unknown" : ""
  }`;

  const pathname = usePathname();

  const DescriptionPopover = () => (
    <Popover>
      <PopoverTrigger className="absolute top-6 right-6 gap-1 flex justify-center items-center rounded-md">
        <ChevronDownIcon className="hover:scale-125 hover:bg-secondary duration-300 rounded-full" />
      </PopoverTrigger>
      <PopoverContent className="mr-4">{description}</PopoverContent>
    </Popover>
  );

  return (
    <Card
      className={cn("w-[330px] sm:w-[348px]", {
        "opacity-50 relative": isOptimistic,
      })}
    >
      <CardHeader className="relative">
        <CardTitle className="break-words max-w-[90%]">
          {isOptimistic ? (
            title
          ) : (
            <Link
              href={slugify(pathname, title, id)}
              className={typography("a")}
            >
              {title} <ExternalLinkIcon />
            </Link>
          )}
          {description && <DescriptionPopover />}
        </CardTitle>
        <CardDescription>
          {formattedDate}
          <span className="float-right">{relativeDay}</span>
          <br />
          {formattedHours}
          <span className="float-right">{formattedDuration}</span>
        </CardDescription>
        {isOptimistic && (
          <LoadingSpinner className="absolute right-[12px] top-[6px] h-4 w-4" />
        )}
      </CardHeader>
      <CardContent className="-mt-1">
        {comment && <CommentAlert>{comment}</CommentAlert>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <ResponsiveFormDialog
          trigger={
            <Button variant={"outline"} disabled={isOptimistic}>
              Edit
            </Button>
          }
          title="Edit workout"
          description="Make changes to your workout here. Click save when you're done."
        >
          <ScrollArea className="h-screen max-h-[70vh] overflow-y-hidden">
            <EditWorkoutForm
              mutate={editOptimistically}
              submitButtonText="Edit"
              isSubmitting={isEditing}
            />
          </ScrollArea>
        </ResponsiveFormDialog>
        <DeleteDialog
          action={() => deleteOptimistically(id)}
          disabled={isOptimistic}
        />
      </CardFooter>
    </Card>
  );
}
