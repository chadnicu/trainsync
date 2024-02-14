import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SetsChartSkeleton() {
  return (
    <Card className="w-fit mx-auto">
      <CardHeader className="text-left">
        <CardTitle>
          <Skeleton className="w-[60%] h-5" />
        </CardTitle>
        <CardDescription className="w-[425px]">
          <Skeleton className="h-5 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Skeleton className="h-36 w-full" />
      </CardContent>
    </Card>
  );
}
