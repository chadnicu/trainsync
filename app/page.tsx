import { H1 } from "@/components/typography";

export const dynamic = "force-static";

export default function Home() {
  return (
    <section>
      <H1 className="text-5xl lg:text-7xl text-center">
        Welcome to TrainSync v2
      </H1>
    </section>
  );
}
