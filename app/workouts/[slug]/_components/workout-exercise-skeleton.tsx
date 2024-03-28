import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LastSetsSkeleton from "./last-sets-skeleton";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import CommentAlert from "@/components/comment";

// fa aista normal

export default function WorkoutExerciseSkeleton() {
  return (
    <Card className="max-w-lg w-full mx-auto text-left relative">
      <CardHeader>
        <LastSetsSkeleton />
        <CardTitle>
          <Skeleton className="w-[94%] h-8" />
          <div className="absolute top-3 right-3">
            <Button variant="ghost" size="icon" disabled>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="space-y-2">
          <span className="block">
            <Skeleton className="w-[94%] h-10" />
          </span>
          <span className="text-foreground pt-2 border-t block">
            <Skeleton className="w-[94%] h-4" />
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="rounded-md h-[44vw] w-full sm:w-full sm:h-[260px] mx-auto" />
        <div>
          {new Array(2).fill(0).map((_, i) => (
            <Skeleton className="h-4 w-20 mx-auto" key={i} />
          ))}
        </div>
        <div className="flex justify-center">
          <button className="text-left">
            <CommentAlert>
              <Skeleton className="w-full h-6" />
            </CommentAlert>
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled>
          Swap
        </Button>
        <Button disabled>Add set</Button>
      </CardFooter>
    </Card>
  );
}
