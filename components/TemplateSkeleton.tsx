import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default async function TemplateSkeleton() {
  return (
    <Card className={cn("h-fit w-fit")}>
      <CardHeader className="relative">
        <CardTitle>
          <Skeleton className="h-10 w-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-24 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between gap-2">
        <Skeleton className="h-10 w-[60px]" />
        <Skeleton className="h-10 w-[75px]" />
      </CardContent>
    </Card>
  );
}
