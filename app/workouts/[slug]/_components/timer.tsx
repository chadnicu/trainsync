import { P } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Workout } from "@/types";
import { useEffect, useState } from "react";

function getTimePassed(started: string | null) {
  if (!started) return "";

  const [hour, minutes] = started.split(":").map((e) => Number(e));

  const start = new Date();
  start.setHours(hour);
  start.setMinutes(minutes);
  // start.setSeconds(0);

  const now = new Date();
  const diff = Math.abs((now.getTime() - start.getTime()) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutesDiff = Math.floor((diff % 3600) / 60);
  const secondsDiff = diff % 60;

  return `${hours}:${minutesDiff}:${secondsDiff}`;

  // const diff = Math.abs(now.getTime() - start.getTime() / 1000);
  // const dateDiff = new Date(diff);
  // return `${
  //   dateDiff.getHours() - 3
  // }:${dateDiff.getMinutes()}:${dateDiff.getSeconds()}`;
}

function getWorkoutDuration(started: string, finished: string) {
  if (!started || !finished) return "";

  const [startHour, startMinute] = started.split(":").map((e) => Number(e));
  const [finishHour, finishMinute] = finished.split(":").map((e) => Number(e));

  const start = new Date();
  start.setHours(startHour);
  start.setMinutes(startMinute);
  // start.setSeconds(0);

  const finish = new Date();
  start.setHours(finishHour);
  start.setMinutes(finishMinute);
  // start.setSeconds(0);

  const diff = Math.abs((finish.getTime() - start.getTime()) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutesDiff = Math.floor((diff % 3600) / 60);
  const secondsDiff = diff % 60;

  return `${hours}:${minutesDiff}:${secondsDiff}`;
}

export default function Timer({ workout }: { workout: Workout }) {
  const { started, finished } = workout;
  const [diff, setDiff] = useState(getTimePassed(started));

  useEffect(() => {
    const interval = setInterval(() => {
      setDiff(getTimePassed(started));
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  return (
    <>
      {!started && <Button>Start workout</Button>}
      {started && <P>Started at: {started}</P>}
      {!!(started && !finished) && <P>Time passed by: {diff}</P>}
      {!!(started && finished) && (
        <P>
          Finished at: {finished}. Workout length:{" "}
          {getWorkoutDuration(started, finished)}
        </P>
      )}
    </>
  );
}
