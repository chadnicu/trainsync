import { Card, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function LogSkeleton() {
  return (
    <Card className="float-left w-full sm:w-[49%] md:w-[32.3%] lg:w-[24%]">
      <CardHeader className="break-words">
        <Skeleton className="h-10"></Skeleton>
      </CardHeader>
    </Card>
  );
}
