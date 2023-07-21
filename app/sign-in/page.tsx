import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full bg-red-500">
      <SignIn />
    </div>
  );
}
