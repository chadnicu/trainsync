import { SignIn } from "@clerk/nextjs";
import { appearance } from "../appearance";

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
