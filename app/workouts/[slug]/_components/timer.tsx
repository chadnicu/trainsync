import { H4 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useUpdateWorkoutPage } from "@/hooks/workout-exercises";
import { WorkoutContext } from "@/hooks/workouts";
import { useContext, useEffect, useState } from "react";

function getTimePassed(started: string | null) {
  if (!started) return "";

  const [hour, minutes, seconds] = (started + ":0")
    .split(":")
    .map((e) => Number(e));

  const start = new Date();
  start.setHours(hour);
  start.setMinutes(minutes);
  start.setSeconds(seconds);

  const now = new Date();
  const diff = Math.abs((now.getTime() - start.getTime()) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutesDiff = Math.floor((diff % 3600) / 60);
  const secondsDiff = diff % 60;

  return `${hours}:${minutesDiff}:${secondsDiff}`;
}

function getWorkoutDuration(started: string, finished: string) {
  if (!started || !finished) return "";

  const [startHour, startMinute, startSecond] = (started + ":0")
    .split(":")
    .map((e) => Number(e) ?? 0);
  const [finishHour, finishMinute, finishSecond] = (finished + ":0")
    .split(":")
    .map((e) => Number(e) ?? 0);

  const start =
    startHour * 60 * 60 * 1000 + startMinute * 60 * 1000 + startSecond * 1000;
  const finish =
    finishHour * 60 * 60 * 1000 +
    finishMinute * 60 * 1000 +
    finishSecond * 1000;

  const diff = Math.abs((finish - start) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutesDiff = Math.floor((diff % 3600) / 60);
  const secondsDiff = diff % 60;

  return `${hours}:${minutesDiff}:${secondsDiff}`;
}

export default function Timer() {
  const { id, title, date, started, finished } = useContext(WorkoutContext);
  const [diff, setDiff] = useState(getTimePassed(started));

  useEffect(() => {
    const interval = setInterval(() => {
      setDiff(getTimePassed(started));
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  const { mutate: updateWorkout } = useUpdateWorkoutPage();

  const defaultValues = {
    id,
    title,
    date: new Date(date ?? ""),
    started: started ?? undefined,
    finished: finished ?? undefined,
  };

  const getFormattedNow = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  };

  const DurationAndTimes = () =>
    !!(started && finished) && (
      <div className="flex items-center justify-between w-full relative">
        <Button
          variant={"outline"}
          onClick={() => {
            setDiff("0:0:0");
            updateWorkout({
              ...defaultValues,
              started: getFormattedNow(),
              finished: undefined,
            });
          }}
        >
          Restart
        </Button>
        <H4 className="absolute inset-0 m-auto w-fit h-fit grid place-items-center">
          {getWorkoutDuration(started, finished)}
          <p className="text-xs font-normal">
            {started.split(":").splice(0, 2).join(":")}
            <span className="mx-[2px]">—</span>
            {finished.split(":").splice(0, 2).join(":")}
          </p>
        </H4>
        <Button
          variant={"outline"}
          onClick={() => {
            setDiff("0:0:0");
            updateWorkout({
              ...defaultValues,
              started: undefined,
              finished: undefined,
            });
          }}
        >
          Delete
        </Button>
      </div>
    );

  const TimePassedBy = () =>
    !!(started && !finished) && (
      <div className="flex items-center justify-between w-full relative">
        <Button
          variant={"outline"}
          onClick={() => {
            setDiff("0:0:0");
            updateWorkout({
              ...defaultValues,
              started: getFormattedNow(),
              finished: undefined,
            });
          }}
        >
          Restart
        </Button>
        <H4 className="absolute inset-0 m-auto w-fit h-fit">{diff}</H4>
        <Button
          variant="outline"
          onClick={() =>
            updateWorkout({ ...defaultValues, finished: getFormattedNow() })
          }
        >
          Finish
        </Button>
      </div>
    );

  const StartWorkoutButton = () =>
    !started && (
      <Button
        variant={"outline"}
        onClick={() => {
          setDiff("0:0:0");
          updateWorkout({ ...defaultValues, started: getFormattedNow() });
        }}
        className="mx-auto"
      >
        Start workout
      </Button>
    );

  return (
    <div className="top-[53px] absolute border-b w-full left-0 backdrop-blur supports-[backdrop-filter]:bg-background/70 ">
      <div className="flex gap-10 p-2">
        <DurationAndTimes />
        <TimePassedBy />
        <StartWorkoutButton />
      </div>
    </div>
  );
}
