"use client";

import SessionForm from "@/components/SessionForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DeleteButton } from "@/components/DeleteButton";
import Link from "next/link";

type Session = {
  title: string;
  id: number;
  description: string | null;
};

async function getSessions() {
  const { data } = await axios.get("/api/sessions");
  return data;
}

export default function Sessions({ sessions }: { sessions: Session[] }) {
  const { data }: { data: Session[] } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
    initialData: sessions,
  });

  return (
    <div className="flex gap-10 p-20">
      <SessionForm />
      <div className="grid grid-cols-5 gap-2">
        {data.map((s) => (
          <div key={s.id} className="grid h-fit gap-2 border p-3">
            <Link
              href={`/sessions/${s.id}`}
              className="text-center text-xl font-bold"
            >
              {s.title}
            </Link>
            <p className="text-sm">{s.description}</p>
            <DeleteButton id={s.id} table={"sessions"}></DeleteButton>
          </div>
        ))}
      </div>
    </div>
  );
}
