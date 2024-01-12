import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciseSkeleton() {
  return (
    <Card className="w-[330px] sm:w-[348px] z-0">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-full">Title</Skeleton>
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-full break-words">
            DescriptionDescriptionDescriptionDescription
          </Skeleton>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-[283px] h-[159px] sm:w-[299px] sm:h-[168px] rounded-md" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="py-2 px-4">Edit</Skeleton>
        <Skeleton className="py-2 px-4">Delete</Skeleton>
      </CardFooter>
    </Card>
  );
}
