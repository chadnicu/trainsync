import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SetSkeleton() {
  return (
    <Card className="w-full max-w-80">
      <CardHeader
        className={"flex-row gap-2 justify-around items-center space-y-0"}
      >
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="py-2 px-4 w-[60%] h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-12" />
      </CardContent>
    </Card>
  );
}
