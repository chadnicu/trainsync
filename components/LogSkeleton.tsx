import { Card, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function LogSkeleton() {
  return (
    <Card className="w-full max-w-[300px]">
      <CardHeader className="break-words">
        <Skeleton className="h-10 w-full" />
      </CardHeader>
    </Card>
  );
}
