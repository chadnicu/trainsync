import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <section className="">
      {Array.from({ length: 1 }, (_, i) => (
        <h1
          key={i}
          className={cn(
            "text-center text-3xl font-bold  md:text-6xl tracking-tighter"
          )}
        >
          Welcome to TrainSync
        </h1>
      ))}
    </section>
  );
}
