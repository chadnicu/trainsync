import { H1, H2, H3, P } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// export const dynamic = "force-static";

export default function Home() {
  return (
    <section className="grid place-items-center">
      <H1 className="text-5xl lg:text-7xl text-center mt-10 ">
        Welcome to TrainSync v2
      </H1>
      <P className="text-center max-w-2xl text-muted-foreground">
        TrainSync is your ultimate companion for achieving your lifting goals
        efficiently and effectively. Seamlessly blending functionality with
        simplicity, TrainSync is a robust web-based workout tracker designed to
        streamline your lifting journey.
      </P>
      <div className="flex gap-2 mt-6">
        <Link href="/workouts" className={buttonVariants()}>
          Get started
        </Link>
        <Link href="/faq" className={buttonVariants({ variant: "outline" })}>
          Learn more
        </Link>
      </div>
      <div className="flex flex-col text-center sm:flex-row sm:items-end sm:gap-2 justify-center mt-20 mb-6 px-2">
        <H3 className="-mb-4 sm:mb-0">What&apos;s in TrainSync?</H3>
        <P className="text-muted-foreground">
          Everything you need to flawlessy track your lifts in the gym.
        </P>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
        {gridContents.map(({ title, description }, i) => (
          <Card
            key={i}
            className="grid place-items-center hover:bg-foreground/5 duration-300"
          >
            <CardHeader>
              <CardTitle className="text-xl tracking-tighter font-bold">
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <H2 className="mt-20 text-4xl sm:text-5xl mb-5">What our users say</H2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {reviews.map(({ fullName, username, content, avatarFallback }, i) => (
          <Card
            key={i}
            className="max-w-80 break-words grid place-items-start hover:bg-foreground/5 duration-300"
          >
            <CardHeader>
              <CardTitle className="-mb-2 flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="text-muted-foreground font-normal text-base">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid">
                  {fullName}
                  <Link
                    href={`https://x.com/${username}`}
                    target="_blank"
                    className="text-sm text-muted-foreground font-normal hover:text-foreground hover:underline duration-300"
                  >
                    @{username}
                  </Link>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">{content}</CardContent>
          </Card>
        ))}
      </div>
      <H2 className=" mt-20 text-4xl sm:text-5xl mb-10">Made possible with</H2>
      <div className="grid sm:flex gap-10 items-center place-items-center">
        <div className="flex gap-8 sm:gap-10 items-center">
          <Link href="https://vercel.com/" target="_blank">
            <Image
              src={"vercel.svg"}
              width={100}
              height={100}
              alt="vercel"
              className="dark:invert"
            />
          </Link>
          <Link href={"https://nextjs.org/"} target="_blank">
            <Image
              src={"next.svg"}
              width={100}
              height={100}
              alt="next"
              className="dark:invert"
            />
          </Link>
          <Link href={"https://react.dev/"} target="_blank">
            <Image
              src={"/react-icon.png"}
              width={50}
              height={50}
              alt="react"
              className="brightness-0 dark:invert"
            />
          </Link>
        </div>
        <div className="flex gap-20 sm:gap-10 items-center">
          <Link href={"https://ui.shadcn.com/"} target="_blank">
            <Image
              src={"/shadcn-icon.png"}
              width={32}
              height={32}
              alt="shadcn"
              className="dark:invert"
            />
          </Link>
          <Link href={"https://tailwindcss.com/"} target="_blank">
            <Image
              src={"/tailwind-icon.png"}
              width={60}
              height={60}
              alt="tailwind"
              className="invert dark:invert-0"
            />
          </Link>
        </div>
        <div className="flex gap-20 sm:gap-10 items-center">
          <Link href={"https://orm.drizzle.team/"} target="_blank">
            <Image
              src={"/drizzle-icon.svg"}
              width={60}
              height={60}
              alt="drizzle"
              className="dark:invert -ml-2"
            />
          </Link>
          <Link href={"https://turso.tech/"} target="_blank">
            <Image
              src={"/turso-icon.png"}
              width={40}
              height={40}
              alt="turso"
              className="brightness-0 dark:invert contrast-200 -ml-2"
            />
          </Link>
        </div>
      </div>
      <div className="mt-7 mb-5">
        Also{" "}
        <Link
          href={"https://tanstack.com/"}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "navLink", fontSize: "md" }),
            "p-0"
          )}
        >
          TanStack Query
        </Link>{" "}
        &{" "}
        <Link
          href={"https://react-hook-form.com/"}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "navLink", fontSize: "md" }),
            "p-0"
          )}
        >
          React Hook Form
        </Link>
      </div>
    </section>
  );
}

const gridContents = [
  {
    title: "Personalised Libraries",
    description:
      "Create your own exercises, workouts and templates, exactly the way you want them performed.",
  },
  {
    title: "Convenience",
    description:
      "Easily authenticate, create, delete, add, remove, swap or reorder things. From any device, anytime.",
  },
  {
    title: "Workout Templates",
    description:
      "No more need to rewrite all of your exercises for a specific workout. Create a template once and import from it.",
    // Create a template and use it anytime you need it.",
  },
  {
    title: "Seamless Syncing",
    description:
      "Being a web-based app, your data is automatically in sync, allowing you to log your workouts anytime, anywhere.",
  },
  {
    title: "No Installation Requirement",
    description:
      "The need for tedious installations and saving valuable storage space on your device is gone.",
  },
  {
    title: "Simplicity",
    description:
      "Although customizeable, TrainSync offers a user-friendly experience with its modern design and intuitive interface.",
    //  Say goodbye to complicated workout trackers and hello to simplicity and ease of use.
  },
];

const reviews = [
  {
    fullName: "Theo - t3.gg",
    username: "t3dotgg",
    content: "I hate TrainSync. You're blocked.",
    avatarFallback: "T3",
  },
  {
    fullName: "ThePrimeagen",
    username: "ThePrimeagen",
    content: "You really thought you'll have users?",
    avatarFallback: "TP",
  },
  {
    fullName: "Literally everyone",
    username: "Everyone",
    content: "Just make a mobile app bozo",
    avatarFallback: "LE",
  },
];
