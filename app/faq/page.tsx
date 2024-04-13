import { H1 } from "@/components/typography";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrainSync • FAQ",
  description: "FAQ page of the free web-based workout tracker",
};

export const dynamic = "force-static";

export default function FAQ() {
  return (
    <section className="space-y-10">
      <div className="space-y-3">
        <H1 className="text-center max-w-2xl mx-auto">
          Frequently Asked Questions
        </H1>
      </div>
      <div className="max-w-lg mx-auto">
        <Accordion type="single" collapsible>
          {QnAs.map(({ question, answer }, i) => (
            <AccordionItem value={`item-${i + 1}`} key={i}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
          <AccordionItem value={`item-${QnAs.length + 1}`}>
            <AccordionTrigger className="text-left">
              Can I report an issue / ask a question / suggest something?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              This would be highly appreciated, message me on{" "}
              <Link
                href={"https://x.com/chadnicu"}
                target="_blank"
                className="brightness-125 hover:text-foreground hover:underline duration-300"
              >
                X
              </Link>{" "}
              or open a{" "}
              <Link
                href={"https://github.com/chadnicu/trainsync"}
                target="_blank"
                className="brightness-125 hover:text-foreground hover:underline duration-300"
              >
                GitHub
              </Link>{" "}
              issue and I&apos;ll try to sort it out.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

const QnAs = [
  {
    question: "What is TrainSync?",
    answer:
      "TrainSync is web-based workout tracking app. It's an easy solution to track your progress in the gym, without the need for any installation.",
  },
  {
    question: "How do I use it?",
    answer:
      "I recommend you first create your exercises, then your templates, and then the workouts (importing from the template).",
  },
  {
    question: "How do I create an exercise?",
    answer:
      "You go to /exercises, click create, enter the exercise information you want and voilà.",
  },
  {
    question: "How do I create a template?",
    answer:
      "You go to /templates, click create and enter the template information. Then you click on the template's name, it will take you it's dynamic page from where you can add the exercises and write how you want them performed (how many sets, reps, what tempo, intensity, etc).",
  },
  {
    question: "How do I create a workout?",
    answer:
      "You go to /workouts, pick a template to import from and boom! (Alternatively you can click create, enter the workout information, click on it's name and add the exercises, but I dont recommend this for structured workout plans).",
  },
  {
    question: "Can I report an issue / ask a question",
    answer:
      "This would be highly appreciated, message me on X or open a GitHub issue and I'll try to sort it out. (links above)",
  },
];
