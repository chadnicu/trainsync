"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useQuery } from "@tanstack/react-query";
import { Session, getSessions } from "@/app/sessions/Sessions";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ThemeChanger } from "./ThemeChanger";
import { dark, shadesOfPurple } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Navbar({
  sessions,
}: {
  sessions: { title: string; href: number; description: string }[];
}) {
  const query: {
    data: { title: string; href: number; description: string }[];
  } = useQuery({
    queryKey: ["sessions-navbar"],
    queryFn: async () => {
      const res = await getSessions().then((d) =>
        d.map((s: Session) => ({
          title: s.title,
          href: s.id,
          description: s.description || "",
        }))
      );
      setData(res);
      return res;
    },
    initialData: sessions,
  });

  const { theme } = useTheme();

  const [data, setData] = React.useState(query.data);

  const { userId } = useAuth();

  return (
    <NavigationMenu className="sticky top-0 flex flex-none justify-between border bg-background p-3">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/exercises" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Exercises
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Sessions
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem
                key={"sessions"}
                title={"All sessions"}
                href={`/sessions`}
              >
                {"View all of your sessions"}
              </ListItem>
              {data.map((sesh) => (
                <ListItem
                  key={sesh.href}
                  title={sesh.title}
                  href={`/sessions/${sesh.href}`}
                >
                  {sesh.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList className="flex gap-2">
        <NavigationMenuItem className="flex">
          <ThemeChanger />
        </NavigationMenuItem>
        <NavigationMenuItem>
          {userId ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
              }}
            />
          ) : (
            <Link href="/sign-in" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Sign in
              </NavigationMenuLink>
            </Link>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
