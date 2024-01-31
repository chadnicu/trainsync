import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Set } from "./helpers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

function averages(sets: Set[]) {
  let averageReps = 0,
    averageWeight = 0;

  sets.map((set) => {
    averageReps += set.reps ?? 0;
    averageWeight += set.weight ?? 0;
  });

  return [averageReps, averageWeight];
}

export default function SetsChart({ sets }: { sets: Set[] }) {
  if (sets.length === 0) return null;

  const [avgReps, avgWeight] = averages(sets);
  const [lastReps, lastWeight] = [
    sets[sets.length - 1].reps ?? 0,
    sets[sets.length - 1].weight ?? 0,
  ];

  return (
    <Card className="w-fit mx-auto">
      <CardHeader className="text-left">
        <CardTitle>Exercise reps and weight graph</CardTitle>
        <CardDescription>
          Your weight is {lastWeight <= avgWeight && "not"} ahead of where it
          normally is
          {lastReps > avgReps
            ? `, and ${
                lastWeight <= avgWeight ? "neither" : "so"
              } are your reps.`
            : `, but your reps are${lastWeight > avgWeight ? " not" : ""}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <div className="h-28 xl:h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sets} className="mx-auto">
              <Tooltip
                content={({ active, payload }) =>
                  !(active && payload && payload.length) ? null : (
                    <div className="grid grid-cols-2 gap-2 rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Reps
                        </span>
                        <span className="font-bold">{payload[1].value}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Weight
                        </span>
                        <span className="font-bold">{payload[0].value}</span>
                      </div>
                    </div>
                  )
                }
              />
              <Line
                type="natural"
                dataKey="weight"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  style: { fill: "hsl(178, 100%, 44%)" },
                }}
                style={{
                  stroke: "hsl(178, 100%, 44%)",
                }}
              />
              <Line
                type="natural"
                dataKey="reps"
                strokeWidth={2}
                activeDot={{
                  r: 8,
                  style: { fill: "hsl(209, 100%, 47%)" },
                }}
                style={{
                  stroke: "hsl(209, 100%, 47%)",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
