import { ClerkProvider as AsyncClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import type { IsomorphicClerkOptions } from "@clerk/clerk-react";
import type { PublishableKeyOrFrontendApi } from "@clerk/types";
import React from "react";
import { dark } from "@clerk/themes";
import { buttonVariants } from "./ui/button";
import { H1 } from "./typography";

type NextAppClerkProviderProps = React.PropsWithChildren<
  Omit<IsomorphicClerkOptions, keyof PublishableKeyOrFrontendApi> &
    Partial<PublishableKeyOrFrontendApi>
>;

const elements = {
  headerTitle: "text-foreground",
  headerSubtitle: "text-zinc-600 dark:text-zinc-500",
  dividerText: "text-zinc-600 dark:text-zinc-500",
  formButtonPrimary: buttonVariants(),
  formFieldLabel: "text-foreground",
  socialButtonsProviderIcon__github: "brightness-50 dark:brightness-[10]",
  formFieldInput: "bg-transparent border border-border text-foreground",
  formFieldSuccessText: "text-zinc-600 dark:text-zinc-500",
  footerActionText: "text-zinc-600 dark:text-zinc-500",
  formField: "gap-1",
  card: "bg-background border-border",
  socialButtonsIconButton__google:
    "border border-zinc-200 dark:border-zinc-700",
  socialButtonsIconButton__github:
    "border border-zinc-200 dark:border-zinc-700",
  socialButtonsIconButton__discord:
    "border border-zinc-200 dark:border-zinc-700",
  dividerLine: "bg-border",
  footerActionLink: "text-foreground hover:text-foreground",
};

export default function ClerkProvider({
  children,
  className,
  ...props
}: NextAppClerkProviderProps & { className: string }) {
  return (
    <Suspense
      fallback={
        <H1 className="absolute inset-0 w-fit h-fit m-auto">Loading clerk..</H1>
      }
    >
      <AsyncClerkProvider
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#f81ce5",
            colorBackground: "#121216",
            borderRadius: "0.5em",
          },
          signIn: { elements },
          signUp: { elements },
        }}
        {...props}
      >
        <div className={className}>{children}</div>
      </AsyncClerkProvider>
    </Suspense>
  );
}
