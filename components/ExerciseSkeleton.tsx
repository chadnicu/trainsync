import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function ExerciseSkeleton() {
  return (
    <Card className="w-full max-w-[350px]">
      <CardHeader className="pb-3 ">
        <CardTitle>
          <Skeleton className="h-4 w-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Skeleton className="h-[168px] w-[299px] " />
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pb-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
