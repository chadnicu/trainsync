"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteButton } from "@/components/DeleteButton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { deleteTemplate, editTemplate } from "../actions";
import EditButton from "@/components/EditButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Template } from "@/lib/types";
import { Label } from "@/components/ui/label";

export default function Templates() {
  const queryClient = useQueryClient();

  function queryTemplates() {
    const data = queryClient.getQueryData(["templates"]);
    if (!data) return [];
    return data as Template[];
  }

  const { data } = useQuery({
    queryKey: ["templates"],
    queryFn: queryTemplates,
    initialData: () => queryTemplates(),
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await deleteTemplate(id);
      queryClient.invalidateQueries(["templates"]);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["templates"] });
      const previous = queryClient.getQueryData(["templates"]);
      queryClient.setQueryData(["templates"], (old: any) =>
        old.filter((s: any) => s.id !== id)
      );
      return { previous };
    },
    onError: (err, newExercise, context) => {
      queryClient.setQueryData(["templates"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return (
    <div>
      {!data?.length && <p>you have no templates</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {data?.map((s) => (
          <div
            key={s.id}
            className="grid h-fit place-items-center gap-5 border px-7 py-5"
          >
            <div>
              <HoverTemplate t={s} />
            </div>
            <div className="flex justify-between gap-2">
              <EditButton
                action={async (formData) =>
                  editTemplate(s, formData).then(() =>
                    queryClient.invalidateQueries(["templates"])
                  )
                }
                header={
                  <EditButton.Header>
                    <EditButton.Title>Edit</EditButton.Title>
                    <EditButton.Description>
                      Make changes to your template here. Click save when you
                      {"'"}re done.
                    </EditButton.Description>
                  </EditButton.Header>
                }
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder={s.title}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={s.description ?? ""}
                    className="col-span-3"
                  />
                </div>
              </EditButton>
              <DeleteButton mutate={() => mutate(s.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoverTemplate({ t }: { t: Template }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/templates/${t?.id}`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "p-0 text-left text-xl font-bold"
          )}
        >
          {t.title}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-fit max-w-xs justify-between space-x-4 space-y-1">
        <p className="text-sm">{t?.description || "No description"}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
