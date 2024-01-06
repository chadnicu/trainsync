import { ThemeToggler } from "@/components/theme-toggler";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

const paths = [
  { title: "Home", href: "/" },
  { title: "Exercises", href: "/exercises" },
  { title: "Workouts", href: "/workouts" },
  { title: "Templates", href: "/templates" },
];

export default function MainNavbar() {
  return (
    <nav className="flex justify-between p-2 border-b sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <ul className="sm:flex gap-2">
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
      <div className="sm:flex gap-2">
        <ThemeToggler />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
