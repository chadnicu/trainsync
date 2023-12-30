"use client";

import * as React from "react";
import Link from "next/link";
import { cn, filterLogs } from "@/lib/utils";
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
import { UserButton, useAuth } from "@clerk/nextjs";
import { ThemeChanger } from "./ThemeChanger";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { getLogs, getTemplates, getWorkouts } from "@/app/actions";
import { Set, Template, Workout } from "@/lib/types";

type Props = {
  workouts: Workout[];
  templates: Template[];
  logs: (Set & {
    title: string;
    exerciseId: number;
  })[];
};

export default function Navbar({ initialData }: { initialData?: Props }) {
  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => getTemplates(),
    initialData: initialData?.templates ?? [],
  });

  const { data: workouts } = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => getWorkouts(),
    initialData: initialData?.workouts ?? [],
  });

  const { data: logs } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => getLogs(),
    initialData: initialData?.logs ?? [],
  });

  const filteredLogs = filterLogs(logs);

  const { theme } = useTheme();

  const { userId } = useAuth();

  return (
    <>
      <NavigationMenu className="sticky top-0 hidden flex-none justify-between border-b bg-background p-3 sm:flex">
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
            <NavigationMenuTrigger>Workouts</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem
                  key={"workouts"}
                  title={"All workouts"}
                  href={`/workouts`}
                >
                  {"View all of your workouts"}
                </ListItem>
                {workouts?.map((workout) =>
                  workout.id ? (
                    <ListItem
                      key={workout.id}
                      title={workout.title}
                      href={`/workouts/${workout.id}`}
                    >
                      {workout.date?.toString().slice(0, 15)}
                    </ListItem>
                  ) : (
                    <Unclickable key={workout.id} title={workout.title}>
                      {workout.date?.toString().slice(0, 15)}
                    </Unclickable>
                  )
                )}
              </ul>
            </NavigationMenuContent>
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
                {templates?.map((template) =>
                  template.id ? (
                    <ListItem
                      key={template.id}
                      title={template.title}
                      href={`/templates/${template.id}`}
                    >
                      {template.description}
                    </ListItem>
                  ) : (
                    <Unclickable key={template.id} title={template.title}>
                      {template.description}
                    </Unclickable>
                  )
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Logs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem key={"logs"} title={"All logs"} href={`/logs`}>
                  {"View all of your logs"}
                </ListItem>
                {filteredLogs?.map((log) =>
                  log.id ? (
                    <ListItem
                      key={log.id}
                      title={log.title}
                      href={`/logs/${log.exerciseId}`}
                    >
                      Logs for {log.title}
                    </ListItem>
                  ) : (
                    <Unclickable key={log.id} title={log.title}>
                      Logs for {log.title}
                    </Unclickable>
                  )
                )}
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
                    userButtonPopoverCard:
                      "bg-transparent backdrop-blur-xl border border-zinc-200 dark:border-zinc-700",
                    userPreview__userButton: "text-foreground",
                    userPreviewSecondaryIdentifier:
                      "text-zinc-600 dark:text-zinc-400",
                    userButtonPopoverActionButton__manageAccount:
                      "text-red-500",
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

      <NavigationMenu className="sticky top-0 flex flex-none justify-between gap-2 border-b bg-background p-3 sm:hidden sm:gap-0">
        <NavigationMenuItem className="flex w-24 list-none justify-start">
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="place-items-right grid w-fit gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem key={"home"} title={"Home"} href={`/`}></ListItem>
              <ListItem
                key={"exercises"}
                title={"Exercises"}
                href={`/exercises`}
              ></ListItem>
              <ListItem
                key={"workouts"}
                title={"Workouts"}
                href={`/workouts`}
              ></ListItem>
              <ListItem
                key={"templates"}
                title={"Templates"}
                href={`/templates`}
              ></ListItem>
              <ListItem key={"logs"} title={"Logs"} href={`/logs`}></ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex w-24 list-none justify-center">
          <ThemeChanger />
        </NavigationMenuItem>
        <NavigationMenuItem className="flex w-24 list-none justify-end">
          {userId ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
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
      </NavigationMenu>
    </>
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
            "hover-text-primary-gradient block select-none space-y-1 rounded-md p-3 pt-4 leading-none no-underline outline-none transition-colors",
            // hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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

const Unclickable = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <div
        className={cn(
          "block select-none space-y-1 rounded-md p-3 pt-4 leading-none no-underline opacity-50 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </div>
    </li>
  );
};
