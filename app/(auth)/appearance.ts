import { buttonVariants } from "@/components/ui/button";

export const appearance = {
  headerTitle: "text-foreground",
  headerSubtitle: "text-foreground",
  dividerText: "text-zinc-500",
  formButtonPrimary: buttonVariants({ variant: "secondary" }),
  formFieldLabel: "text-foreground",
  socialButtonsProviderIcon__github: "brightness-50 dark:brightness-[10]",
  formFieldInput:
    "bg-transparent border border-zinc-300 dark:border-zinc-700 text-foreground",
  formFieldSuccessText: "text-zinc-500",
  footerActionText: "text-zinc-500",
  formField: "gap-1",
  card: "bg-background dark:border-zinc-700",
  socialButtonsIconButton__google:
    "border border-zinc-200 dark:border-zinc-700",
  socialButtonsIconButton__github:
    "border border-zinc-200 dark:border-zinc-700",
  socialButtonsIconButton__discord:
    "border border-zinc-200 dark:border-zinc-700",
  dividerLine: "bg-zinc-200 dark:bg-zinc-700",
  footerActionLink: "text-foreground hover:text-foreground",
};
