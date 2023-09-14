"use client";

import { useEffect, useState } from "react";

export default function TimePassed({ started }: { started: number }) {
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(new Date().getTime() - started);
    }, 1000);

    return () => clearInterval(interval);
  }, [timePassed, started]);

  const date = new Date(timePassed);

  return (
    <div>
      Time passed by: {date.getHours() - 3}:{date.getMinutes()}:
      {date.getSeconds()}
    </div>
  );
}
