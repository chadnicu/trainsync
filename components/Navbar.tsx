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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ThemeChanger } from "./ThemeChanger";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { getTemplates } from "@/app/actions";
import { Template } from "@/lib/types";

export default function Navbar({ templates }: { templates: Template[] }) {
  const { data } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
    initialData: templates,
  });

  const { theme } = useTheme();

  const { userId } = useAuth();

  return (
    <NavigationMenu className="sticky top-0 flex flex-none justify-between border-b bg-background p-3">
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
          <Link href="/workouts" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Workouts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Templates</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem
                key={"templates"}
                title={"All templates"}
                href={`/templates`}
              >
                {"View all of your templates"}
              </ListItem>
              {data?.map((template) => (
                <ListItem
                  key={template.id}
                  title={template.title}
                  href={`/templates/${template.id}`}
                >
                  {template.description}
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
                elements: {
                  // temporary fix for white mode user button
                  userButtonPopoverCard:
                    "bg-transparent backdrop-blur-xl border border-zinc-200 dark:border-zinc-700",
                  userPreview__userButton: "text-foreground",
                  userPreviewSecondaryIdentifier:
                    "text-zinc-600 dark:text-zinc-400",
                  userButtonPopoverActionButton__manageAccount: "text-red-500",
                  userButtonPopoverActionButtonText:
                    "text-zinc-500 dark:text-zinc-400",
                  userButtonPopoverActionButtonIcon__manageAccount:
                    "text-zinc-400 dark:text-zinc-400",
                  userButtonPopoverActionButtonIcon__signOut:
                    "text-zinc-400 dark:text-zinc-400",
                },
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
