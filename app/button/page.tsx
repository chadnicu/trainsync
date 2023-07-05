"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [button, setButton] = useState(0);
  return (
    <div className="absolute inset-0 m-auto h-96 w-96">
      <div className="relative">
        {button ? (
          <Button
            className="absolute left-10 top-10 active:bg-red-200"
            onMouseEnter={() => setButton(0)}
            onFocus={() => setButton(0)}
            onClick={() => setButton(0)}
          >
            Click me
          </Button>
        ) : (
          <Button
            className="absolute right-10 top-10"
            onMouseEnter={() => setButton(1)}
            onFocus={() => setButton(1)}
            onClick={() => setButton(1)}
          >
            Click me
          </Button>
        )}
      </div>
    </div>
  );
}
