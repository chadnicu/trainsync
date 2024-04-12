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
  { title: "About", href: "/about" },
];

export default function MainNavbar() {
  const AppLinks = () => (
    <ul className="grid text-xl sm:text-base sm:flex">
      {paths.map(({ title, href }, i) => (
        <li key={i}>
          <Link
            href={href}
            className={buttonVariants({ variant: "navLink", fontSize: "md" })}
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
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
        {/* <Socials /> */}
        <ThemeToggler />
        <AuthButton />
      </div>
    </nav>
  );
}
