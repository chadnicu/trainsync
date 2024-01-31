import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-static";

export default function SignInPage() {
  return <SignIn />;
}
