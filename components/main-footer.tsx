import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { P } from "./typography/p";

export default function MainFooter() {
  const className = cn(
    buttonVariants({ variant: "link", fontSize: "sm" }),
    "-ml-3 -mr-4"
  );

  return (
    <footer className="py-2 px-4 text-sm sm:text-center border-t">
      <P className="-space-y-2">
        Made by
        <Link href="https://twitter.com/iusedebian" className={className}>
          iusedebian
        </Link>
        . <br className="sm:hidden" />
        Source code is available on
        <Link
          href="https://github.com/iusedebian/workout-tracker"
          className={className}
        >
          GitHub
        </Link>
        .
      </P>
    </footer>
  );
}
