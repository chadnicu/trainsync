import { H1, H2, H3, P } from "@/components/typography";
import FAQAccordion from "./_components/faq-accordion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function About() {
  const Socials = () => (
    <div className="flex items-center  mx-auto w-fit">
      <span className="text-muted-foreground">
        Brought to you by @chadnicu. Follow me on
      </span>
      <Link
        href={"https://x.com/chadnicu"}
        target="_blank"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <svg
          className="fill-current h-[1.1rem] w-[1.1rem]"
          viewBox="0 0 1200 1227"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
        </svg>
      </Link>
      <span className="text-muted-foreground">and</span>
      <Link
        href={"https://github.com/chadnicu"}
        target="_blank"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <GitHubLogoIcon className="w-[1.2rem] h-[1.2rem]" />
      </Link>
    </div>
  );

  return (
    <section className="space-y-10">
      <div className="space-y-3">
        <H1 className="text-center">About TrainSync</H1>
        <Socials />
      </div>
      <div className="max-w-lg mx-auto">
        <H2>FAQ</H2>
        <FAQAccordion />
      </div>
    </section>
  );
}
