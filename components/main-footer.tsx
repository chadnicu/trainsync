import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { P } from "@/components/typography";

export default function MainFooter() {
  const className = cn(
    buttonVariants({ variant: "link", fontSize: "sm" }),
    "-ml-3 -mr-4"
  );

  return (
    <footer className="py-2 px-4 text-sm sm:text-center border-t">
      <P className="-space-y">
        Made by
        <Link
          href="https://x.com/chadnicu"
          className={className}
          target="_blank"
        >
          chadnicu
        </Link>
        . <br className="sm:hidden" />
        Source code is available on
        <Link
          href="https://github.com/chadnicu/workout-tracker"
          className={className}
          target="_blank"
        >
          GitHub
        </Link>
        .
      </P>
    </footer>
  );
}
