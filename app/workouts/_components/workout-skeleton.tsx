import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutSkeleton() {
  return (
    <Card className="w-[330px] sm:w-[348px]">
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-full h-4" />
        </CardTitle>
        <CardDescription className="space-y-1">
          <span className="flex gap-28">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </span>
          <span className="flex gap-28">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-16" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="w-[60px] h-9" />
        <Skeleton className="w-[75px] h-9" />
      </CardFooter>
    </Card>
  );
}
