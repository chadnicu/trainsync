import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export default function CoolView({
  data,
  button,
}: {
  data: {
    id: number;
    title: string;
    instructions: string | null;
    url: string | null;
  };
  button: JSX.Element;
}) {
  return (
    <div className="flex w-80 items-center justify-between border p-5">
      <div className="text-left">
        <h2 className="text-xl font-bold">{data.title}</h2>
        <p className="text-sm">{data.instructions}</p>
      </div>
      <div className="">{button}</div>
    </div>
  );
}
