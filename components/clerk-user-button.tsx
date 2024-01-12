"use client";

import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const elements = {
  userButtonPopoverCard:
    "backdrop-blur supports-[backdrop-filter]:bg-background/70 border-border",
  userPreview__userButton: "text-foreground",
  userPreviewSecondaryIdentifier: "text-zinc-600 dark:text-zinc-400",
  userButtonPopoverActionButton__manageAccount: "text-red-500",
  userButtonPopoverActionButtonText: "text-zinc-600 dark:text-zinc-400",
  userButtonPopoverActionButtonIcon__manageAccount:
    "text-zinc-600 dark:text-zinc-400",
  userButtonPopoverActionButtonIcon__signOut:
    "text-zinc-600 dark:text-zinc-400",
};

export default function ClerkUserButton() {
  const { theme } = useTheme();

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        elements,
      }}
    />
  );
}
