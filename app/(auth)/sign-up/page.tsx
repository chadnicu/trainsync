import { SignUp } from "@clerk/nextjs";
import { appearance } from "../appearance";

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
