import { SignUp } from "@clerk/nextjs";
import { appearance } from "../appearance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="flex w-full justify-center">
      <SignUp
        appearance={{
          elements: appearance,
        }}
      />
    </div>
  );
}
