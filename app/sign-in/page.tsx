"use client";

import { buttonVariants } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const { theme } = useTheme();

  return (
    <div className="flex w-full justify-center">
      <SignIn
        appearance={{
          baseTheme: theme === "light" ? undefined : dark,
          elements: {
            formButtonPrimary: buttonVariants(),
          },
        }}
      />
    </div>
  );
}
