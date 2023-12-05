"use client";

import { useEffect, useState } from "react";

export default function TimePassed({ since }: { since: number | null }) {
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(new Date().getTime() - (since ? since : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timePassed, since]);

  if (!since) return <div className="hidden"></div>;
  const date = new Date(timePassed);

  return (
    <div>
      Time passed by: {date.getHours() - 3}:{date.getMinutes()}:
      {date.getSeconds()}
    </div>
  );
}
