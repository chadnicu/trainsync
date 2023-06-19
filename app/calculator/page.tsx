"use client";

import { useState } from "react";

export default function Page() {
  const [operator, setOperator] = useState<string>();
  const [first, setFirst] = useState<number>();
  const [second, setSecond] = useState<number>();

  const calculate = () => {
    if (!first || !second) return;

    switch (operator) {
      case "+":
        setFirst(first + second);
        break;
      case "-":
        setFirst(first - second);
        break;
      case "*":
        setFirst(first * second);
        break;
      case "/":
        setFirst(first / second);
        break;
    }

    setSecond(undefined);
  };

  return (
    <div className="p-20 text-center">
      <div className="flex justify-center gap-3">
        <Operator sign={"+"} handler={() => setOperator("+")} />
        <Operator sign={"-"} handler={() => setOperator("-")} />
        <Operator sign={"*"} handler={() => setOperator("*")} />
        <Operator sign={"/"} handler={() => setOperator("/")} />
        <Operator sign={"="} handler={calculate} classes="bg-cyan-700" />
      </div>
      <div className="mt-10 flex items-center justify-center gap-3">
        <input
          type="number"
          value={first}
          className="h-12 w-28 border bg-transparent text-center"
          onChange={(e) => setFirst(parseInt(e.currentTarget.value))}
        />
        <p className="text-3xl">{operator}</p>
        <input
          type="number"
          value={second ?? ""}
          className="h-12 w-28 border bg-transparent text-center"
          onChange={(e) => setSecond(parseInt(e.currentTarget.value))}
        />
      </div>
    </div>
  );
}

function Operator({
  sign,
  handler,
  classes,
}: {
  sign: string;
  handler: () => void;
  classes?: string;
}) {
  return (
    <button
      onClick={handler}
      className={`h-12 w-12 border text-xl font-bold ${classes}`}
    >
      {sign}
    </button>
  );
}
