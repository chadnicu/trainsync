import { H1, H3, P } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-static";

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
        <Link href="/about" className={buttonVariants({ variant: "outline" })}>
          Learn more
        </Link>
      </div>
      <div className="flex flex-col text-center sm:flex-row items-end gap-2 justify-center mt-20 mb-6 px-2">
        <H3>What&apos;s in TrainSync?</H3>
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
              <CardTitle className="text-xl tracking-tighter">
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
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
    title: "User Friendly",
    description:
      "Although customizeable, TrainSync offers a user-friendly experience with its modern design and intuitive interface.",
    //  Say goodbye to complicated workout trackers and hello to simplicity and ease of use.
  },
];
