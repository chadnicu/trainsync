import { P } from "@/components/typography";
import Link from "next/link";
import CommentAlert from "@/components/comment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import dayjs from "@/lib/dayjs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkoutSet } from "@/app/workouts/[id]/_utils/types";

export default function SetCard({ sets }: { sets: WorkoutSet[] }) {
  const [date, title, comment] = [
    sets[0].workoutDate,
    sets[0].workoutTitle,
    sets[0].comment,
  ];
  const dayJsDate = dayjs(date);
  const formattedDate = dayJsDate.format("DD-MM-YYYY");

  return (
    <Card className="max-w-80 w-full h-fit">
      <CardHeader
        className={"flex-row gap-2 justify-around items-center space-y-0"}
      >
        <div className="space-y-0">
          {sets.map((e) => (
            <P key={e.id}>
              {e.reps}x{e.weight}
            </P>
          ))}
        </div>
        <Link
          href={`/workouts/${sets[0].workoutId}`}
          className={cn(
            buttonVariants({ variant: "navLink" }),
            // fix this overflow somehow
            "break-words max-w-[70%]"
          )}
        >
          {title} | {formattedDate}
        </Link>
      </CardHeader>
      {comment && (
        <CardContent className="text-left">
          <CommentAlert>{comment}</CommentAlert>
        </CardContent>
      )}
    </Card>
  );
}
