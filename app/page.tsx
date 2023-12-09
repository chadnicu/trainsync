import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Page() {
  return (
    <div className="mb-20 break-words text-center font-bold tracking-tighter sm:mb-10">
      <h1 className="text-6xl sm:text-7xl md:text-8xl ">
        Train
        <span className="primary-text-gradient">Sync</span>
      </h1>
      <h2 className="text-2xl sm:text-3xl md:text-4xl">
        Stop
        <span className="primary-text-gradient"> guessing</span>,{" "}
        <br className="sm:hidden" />
        start
        <span className="primary-text-gradient"> progressing</span>.
      </h2>
      <h4 className="absolute inset-x-0 bottom-7 mx-auto flex w-fit items-center justify-center text-xl sm:text-2xl md:text-3xl">
        by&nbsp;
        <Link
          href={"https://github.com/iusedebian/workout-tracker"}
          className="hover:primary-text-gradient flex items-center justify-center gap-1"
          target="/blank"
        >
          iusedebian
          <GitHubLogoIcon className="text-foreground" height={32} width={32} />
        </Link>
      </h4>
    </div>
  );
}
