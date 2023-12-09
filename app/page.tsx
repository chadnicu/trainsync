import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Page() {
  return (
    <div className="mb-20 break-words text-center font-bold sm:mb-10">
      <h1 className="text-6xl sm:text-7xl md:text-8xl">
        Train
        <span className="text-primary">Sync</span>
      </h1>
      <h3 className="flex justify-center text-2xl sm:text-3xl md:text-4xl">
        by&nbsp;
        <Link
          href={"https://github.com/iusedebian/workout-tracker"}
          className="flex items-center justify-center gap-1 hover:text-primary"
          target="/blank"
        >
          iusedebian
          <GitHubLogoIcon height={32} width={32} />
        </Link>
      </h3>
    </div>
  );
}
