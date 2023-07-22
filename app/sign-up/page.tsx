"use client";

import { authElements } from "@/lib/clerk-styles";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="flex w-full justify-center">
      <SignUp
        appearance={{
          baseTheme: theme === "light" ? undefined : dark,
          elements: authElements
        }}
      />
    </div>
  );
}
