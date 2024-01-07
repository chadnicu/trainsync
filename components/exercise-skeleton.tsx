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
    <Card className="w-[330px] sm:w-[348px] z-0">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-full">Title</Skeleton>
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-full">
            DescriptionDescriptionDescriptionDescriptionDescription
          </Skeleton>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-[299px] h-[168px] rounded-md" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="py-2 px-4">Edit</Skeleton>
        <Skeleton className="py-2 px-4">Delete</Skeleton>
      </CardFooter>
    </Card>
  );
}
