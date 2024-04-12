import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQAccordion() {
  return (
    <Accordion type="single" collapsible>
      {QnAs.map(({ question, answer }, i) => (
        <AccordionItem value={`item-${i}`} key={i}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
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
      "This would be highly appreciated, message me on X or open a GitHub issue and I'll try to sort it out.",
  },
];
