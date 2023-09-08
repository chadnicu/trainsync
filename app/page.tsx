import { Github, GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <h1 className="mb-20 break-words text-center text-5xl font-bold sm:mb-10 md:text-6xl">
      Workout Tracker
      <Link
        href={"https://github.com/iusedebian/workout-tracker"}
        className="flex items-center justify-center gap-1 text-purple-300"
        target="/blank"
      >
        <span className="text-primary">by</span>@iusedebian
        <GithubIcon size={50} />
      </Link>
    </h1>
  );
}
