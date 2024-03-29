"use client";

import DeleteDialog from "@/components/delete-dialog";
import LoadingSpinner from "@/components/loading-spinner";
import ResponsiveFormDialog from "@/components/responsive-form-dialog";
import { typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TemplateContext,
  useDeleteTemplate,
  useUpdateTemplate,
} from "@/hooks/tanstack/templates";
import { cn, slugify } from "@/lib/utils";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import TemplateForm from "./template-form";

export default function TemplateCard() {
  const { id, title, description } = useContext(TemplateContext);
  const isOptimistic = id === 0;

  const pathname = usePathname();

  const { mutate: deleteTemplate } = useDeleteTemplate();
  const { mutate: updateTemplate, isPending: isEditing } = useUpdateTemplate();

  return (
    <Card
      className={cn("w-[330px] sm:w-[348px]", {
        "opacity-50 relative": isOptimistic,
      })}
    >
      <CardHeader className="relative">
        <CardTitle className="break-words max-w-[90%]">
          {isOptimistic ? (
            title
          ) : (
            <Link
              href={slugify(pathname, title, id)}
              className={typography("a")}
            >
              {title} <ExternalLinkIcon />
            </Link>
          )}
        </CardTitle>
        <CardDescription>
          {description && <CardDescription>{description}</CardDescription>}
          {isOptimistic && (
            <LoadingSpinner className="absolute right-[12px] top-[6px] h-4 w-4" />
          )}
        </CardDescription>
      </CardHeader>
      {/* <CardContent>hz ce sa pun aici</CardContent> */}
      <CardFooter className="flex justify-between">
        <ResponsiveFormDialog
          trigger={
            <Button variant={"outline"} disabled={isOptimistic}>
              Edit
            </Button>
          }
          title="Edit template"
          description="Make changes to your template here. Click save when you're done."
        >
          <TemplateForm
            mutate={(values) => updateTemplate({ ...values, id })}
            submitButtonText="Edit"
            isSubmitting={isEditing}
          />
        </ResponsiveFormDialog>
        <DeleteDialog
          action={() => deleteTemplate(id)}
          disabled={isOptimistic}
        />
      </CardFooter>
    </Card>
  );
}
