import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cross2Icon, TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import CommentAlert from "@/components/comment";
import { cn } from "@/lib/utils";
import { H3, P, typography } from "@/components/typography";
import LoadingSpinner from "@/components/loading-spinner";

export default function WorkoutExerciseSkeleton() {
  return (
    <Card className="max-w-lg w-full mx-auto text-left relative">
      <CardHeader>
        <P className="text-sm text-muted-foreground hover:brightness-150 duration-300 max-w-[94%] break-words">
          Last sets..
        </P>
        <CardTitle className={cn("flex items-center gap-1")}>
          <LoadingSpinner className="h-5 w-5" />
          <span className={cn(typography("h3"), "block")}>Exercise Title</span>
          <div className="absolute top-3 right-3">
            <Button variant="ghost" size="icon" disabled>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="space-y-2">
          <span className="block">Exercise description</span>
          <span className="text-foreground pt-2 border-t block">
            Exercise to-do
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="rounded-md h-[44vw] w-full sm:w-full sm:h-[260px] mx-auto" />
        <div className="space-y-3">
          {new Array(2).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-8 w-[100px] mx-auto flex justify-between items-center"
            >
              <Skeleton className="w-8 h-8" />
              <Cross2Icon className="opacity-75" />
              <Skeleton className="w-8 h-8" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-3">
          <Button variant="outline" disabled>
            Swap
          </Button>
          <Button variant="outline" disabled>
            Comment
          </Button>
        </div>
        <Button disabled>Add set</Button>
      </CardFooter>
    </Card>
  );
}
