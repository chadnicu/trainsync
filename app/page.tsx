import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Github, GithubIcon, LucideGithub } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <h1 className="mb-20 break-words text-center text-5xl font-bold sm:mb-10 md:text-6xl">
      Workout Tracker
      <Link
        href={"https://github.com/iusedebian/workout-tracker"}
        className="mt-1 flex items-center justify-center gap-1 text-4xl text-purple-300 md:text-5xl"
        target="/blank"
      >
        <span className="text-primary">by</span>
        &nbsp;iusedebian
        <GitHubLogoIcon height={40} width={40} />
      </Link>
    </h1>
  );
}
