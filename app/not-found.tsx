import { H1 } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-static";

export default function NotFound() {
  return (
    <section className="flex flex-col justify-center items-center gap-7">
      <H1>404</H1>
      <p className="-mt-4">This page could not be found.</p>
      <Link href={"/"} className={buttonVariants({ variant: "default" })}>
        Go home
      </Link>
    </section>
  );
}
