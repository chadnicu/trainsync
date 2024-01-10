import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function WorkoutSkeleton() {
  return (
    <Card className="w-[330px] sm:w-[348px]">
      <CardHeader>
        {/* add a popover for description maybe */}
        <CardTitle>
          <Skeleton className="w-full">Title</Skeleton>
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-full break-words">
            Fri Dec 29 2023 09:46:27 GMT+0000 (Coordinated Universal Time)
          </Skeleton>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <Skeleton className="w-full">started: started</Skeleton>
        <Skeleton className="w-full">finished: finished</Skeleton>
        <Skeleton className="w-full">comment: comment</Skeleton>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="py-2 px-4">Edit</Skeleton>
        <Skeleton className="py-2 px-4">Delete</Skeleton>
      </CardFooter>
    </Card>
  );
}
