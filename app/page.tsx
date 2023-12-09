import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Page() {
  const coolGradient =
    "bg-gradient-to-tr from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-red-500";

  return (
    <div className="mb-20 break-words text-center font-bold tracking-tighter sm:mb-10">
      <h1 className="text-6xl sm:text-7xl md:text-8xl ">
        Train
        <span className={coolGradient}>Sync</span>
      </h1>
      <h2 className="text-2xl sm:text-3xl md:text-4xl">
        Stop
        <span className={coolGradient}> guessing</span>,{" "}
        <br className="sm:hidden" />
        start
        <span className={coolGradient}> progressing</span>.
      </h2>
      <h4 className="absolute inset-x-0 bottom-7 mx-auto flex w-fit justify-center text-xl sm:text-2xl md:text-3xl">
        by&nbsp;
        <Link
          href={"https://github.com/iusedebian/workout-tracker"}
          className="flex items-center justify-center gap-1 hover:bg-red-500 hover:bg-gradient-to-tr hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 hover:bg-clip-text hover:text-transparent"
          target="/blank"
        >
          iusedebian
          <GitHubLogoIcon className="text-white" height={32} width={32} />
        </Link>
      </h4>
    </div>
  );
}
