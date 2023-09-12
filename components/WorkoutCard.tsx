import { Workout } from "@/lib/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DeleteButton } from "./DeleteButton";
import EditButton from "./EditButton";
import { deleteWorkout, editWorkout } from "@/app/(pages)/actions";
import { FormProvider, useForm } from "react-hook-form";
import { workoutSchema } from "./WorkoutForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@clerk/nextjs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await deleteWorkout(id);
      queryClient.invalidateQueries(["workouts"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });
      const previous = queryClient.getQueryData(["workouts"]);
      queryClient.setQueryData(["workouts"], (old: any) =>
        old.filter((s: any) => s.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["workouts"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  const form = useForm<z.infer<typeof workoutSchema>>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title: workout.title,
      description: workout.description ?? undefined,
      date: new Date(),
    },
  });

  const { userId } = useAuth();

  const { mutate: editOptimistically } = useMutation({
    mutationFn: async (values: z.infer<typeof workoutSchema>) => {
      await editWorkout(workout.id, values);
      queryClient.invalidateQueries(["workouts"]);
    },
    onMutate: async (values: z.infer<typeof workoutSchema>) => {
      await queryClient.cancelQueries({ queryKey: ["workouts"] });
      const previous = queryClient.getQueryData(["workouts"]);
      queryClient.setQueryData(["workouts"], (old: any) => {
        console.log(old, "old");
        return old.map((e: Workout) =>
          e.id === workout.id ? { id: workout.id, userId, ...values } : e
        );
      });
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["workouts"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  return (
    <Card className="h-fit w-fit">
      <CardHeader>
        {/* <CardTitle> */}
        <HoverWorkout workout={workout} />
        {/* </CardTitle> */}
        <CardDescription>
          {workout.date.toString().slice(0, 15)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between gap-2">
        <EditButton description="workout">
          <FormProvider {...form}>
            <form
              className="grid gap-4 text-left"
              onSubmit={form.handleSubmit(
                (values: z.infer<typeof workoutSchema>) =>
                  editOptimistically(values)
              )}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title of the template"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Optionally describe this template"
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit">Save changes</Button>
            </form>
          </FormProvider>
        </EditButton>
        <DeleteButton mutate={() => mutate(workout.id)} />
      </CardContent>
    </Card>
  );
}

function HoverWorkout({ workout }: { workout: Workout }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/workouts/${workout.id}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-left text-2xl font-bold text-foreground"
          )}
        >
          {workout.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{workout?.description || "No description"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
