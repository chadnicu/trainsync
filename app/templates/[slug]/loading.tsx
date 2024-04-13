'use client';

import LoadingSpinner from "@/components/loading-spinner";
import { Blockquote, H1, H4, P, typography } from "@/components/typography";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrashIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

export default function LoadingTemplate() {
  const pathname = usePathname();
  const last = pathname.split("/")[2].split("-");
  const name = last
    .toSpliced(last.length - 1)
    .join(" ")
    .toUpperCase();

  const isOptimistic = true;

  const TemplateExerciseSkeletons = () =>
    new Array(5).fill(null).map((_, i) => (
      <Card
        key={i}
        className={
          "max-w-[330px] sm:max-w-lg w-full mx-auto text-left relative"
        }
      >
        <CardHeader>
          <CardTitle
            className={cn(
              { "opacity-70": isOptimistic },
              "flex items-center gap-1 max-w-[94%]"
            )}
          >
            {isOptimistic && <LoadingSpinner className="h-5 w-5" />}
            <span className={cn(typography("h3"), "flex items-start ")}>
              <span className="text-muted-foreground font-semibold mr-1">
                {i + 1}.
              </span>
              Loading exercise title..
            </span>
            <button
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "absolute top-3 right-3"
              )}
              disabled={isOptimistic}
            >
              <TrashIcon className="h-4 w-4 text-foreground" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-7">
          <Blockquote className="m-0 text-muted-foreground">
            Loading to-do..
          </Blockquote>
          <div className="space-x-[5px] sm:space-x-3">
            <Button variant={"outline"} disabled={isOptimistic}>
              Add to-do
            </Button>
            <Button variant={"outline"} disabled={isOptimistic}>
              Swap
            </Button>
            <Button
              variant={"outline"}
              disabled={isOptimistic}
              className="float-right"
            >
              See more
            </Button>
          </div>
        </CardContent>
      </Card>
    ));

  return (
    <>
      <section className="sm:container text-center space-y-4">
        <H1>{name}</H1>
        <P className="max-w-lg mx-auto text-muted-foreground pb-2">
          Loading description..
        </P>
        <TemplateExerciseSkeletons />
        <div className="flex flex-col gap-2 min-[370px]:flex-row w-fit mx-auto">
          <Button variant="outline" disabled>
            Edit exercise order
          </Button>
          <Button variant="outline" disabled>
            Add another exercise
          </Button>
        </div>
      </section>
    </>
  );
}
