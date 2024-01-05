import { ThemeToggler } from "@/components/theme-toggler";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const paths = [
  { title: "Home", href: "/" },
  { title: "Exercises", href: "/exercises" },
  { title: "Workouts", href: "/workouts" },
  { title: "Templates", href: "/templates" },
];

export default function MainNavbar() {
  return (
    <nav className="flex justify-between p-5 border-b sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <ul className="sm:flex gap-6">
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
      <ThemeToggler />
    </nav>
  );
}
