import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mb-20 break-words text-center font-bold sm:mb-10">
      <h1 className="text-5xl md:text-6xl">
        Workout
        <span className="text-primary">Tracker</span>
      </h1>
      <h3 className="flex justify-center text-4xl md:text-5xl">
        by&nbsp;
        <Link
          href={"https://github.com/iusedebian/workout-tracker"}
          className="flex items-center justify-center gap-1 hover:text-primary "
          target="/blank"
        >
          iusedebian
          <GitHubLogoIcon height={40} width={40} />
        </Link>
      </h3>
    </div>
  );
}
