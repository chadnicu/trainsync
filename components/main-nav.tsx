"use client";

import { ThemeToggler } from "@/components/theme-toggler";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import MobileNavMenu from "./mobile-nav-menu";
import ClerkUserButton from "./clerk-user-button";
import Image from "next/image";

const paths = [
  // { title: "Home", href: "/" },
  { title: "Exercises", href: "/exercises" },
  { title: "Workouts", href: "/workouts" },
  { title: "Templates", href: "/templates" },
  { title: "FAQ", href: "/faq" },
];

export default function MainNavbar() {
  const AppLinks = () => (
    <ul className="grid text-xl sm:text-base sm:flex sm:items-center">
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
      <div className="hidden sm:flex items-center justify-center ml-1 text-xl sm:text-base">
        <Link
          href={"/"}
          className={cn(
            "hidden sm:flex tracking-tighter font-extrabold gap-2 text-gradient"
          )}
        >
          <Image
            src={"./trainsync-light.svg"}
            width={20}
            height={20}
            alt="TrainSync Logo"
            className="invert dark:invert-0 brightness-[0.8]"
          />
          TrainSync
        </Link>
      </div>
      <div className="hidden sm:block mr-1">
        {/* ml-2 mr-auto */}
        <AppLinks />
      </div>
      <div className="sm:hidden">
        <MobileNavMenu>
          <AppLinks />
        </MobileNavMenu>
      </div>
      <div className="flex w-[100px] justify-end">
        <ThemeToggler />
        <AuthButton />
      </div>
    </nav>
  );
}
