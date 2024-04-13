import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { P } from "@/components/typography";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function MainFooter() {
  const className = cn(
    buttonVariants({ variant: "navLink", fontSize: "sm" }),
    "p-0 ml-[3px]"
  );

  return (
    <footer className="py-2 px-4 text-sm sm:text-center border-t">
      <div className="sm:flex items-center gap-[6px] justify-center">
        <p>
          Made with ❤️ by
          <Link
            href="https://x.com/chadnicu"
            className={className}
            target="_blank"
          >
            chadnicu
          </Link>
          .
        </p>
        <p className="-mt-2 sm:mt-0">
          Follow me on
          <Link
            href="https://x.com/chadnicu"
            className={className}
            target="_blank"
          >
            X
          </Link>{" "}
          and
          <Link
            href="https://github.com/chadnicu/trainsync"
            className={className}
            target="_blank"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
