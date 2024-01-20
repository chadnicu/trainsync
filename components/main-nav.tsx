"use client";

import { ThemeToggler } from "@/components/theme-toggler";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import MobileNavMenu from "./mobile-nav-menu";
import ClerkUserButton from "./clerk-user-button";

const paths = [
  { title: "Home", href: "/" },
  { title: "Exercises", href: "/exercises" },
  { title: "Workouts", href: "/workouts" },
  { title: "Templates", href: "/templates" },
  { title: "Logs", href: "/logs" },
];

export default function MainNavbar() {
  const AppLinks = () => (
    <ul className="grid text-xl sm:text-base sm:flex">
      {paths.map(({ title, href }, i) => (
        <li key={i}>
          <Link
            href={href}
            className={buttonVariants({ variant: "link", fontSize: "md" })}
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );

  const Socials = () => (
    <>
      <Link
        href={"https://github.com/chadnicu"}
        target="_blank"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <GitHubLogoIcon className="w-[1.2rem] h-[1.2rem]" />
      </Link>
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
    </>
  );

  const AuthButton = () => (
    <>
      <SignedIn>
        <div className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <div className="scale-[.80]">
            <ClerkUserButton />
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <Link className={buttonVariants({ variant: "ghost" })} href="/sign-in">
          Sign In
        </Link>
      </SignedOut>
    </>
  );

  return (
    <nav className="flex justify-between p-2 border-b sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-background/70 z-10">
      <div className="hidden sm:block">
        <AppLinks />
      </div>
      <div className="sm:hidden">
        <MobileNavMenu>
          <AppLinks />
        </MobileNavMenu>
      </div>
      <div className="flex">
        <Socials />
        <ThemeToggler />
        <AuthButton />
      </div>
    </nav>
  );
}
