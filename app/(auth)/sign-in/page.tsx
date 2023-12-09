import { SignIn } from "@clerk/nextjs";
import { appearance } from "../appearance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="flex w-full justify-center">
      <SignIn
        appearance={{
          elements: appearance,
        }}
      />
    </div>
  );
}
