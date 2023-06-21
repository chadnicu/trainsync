"use client";

import SessionForm from "@/components/SessionForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DeleteButton } from "@/components/DeleteButton";
import Link from "next/link";
import CoolView from "@/components/CoolView";

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
      <div className="grid grid-cols-2 gap-2">
        {data.map((s) => (
          <div key={s.id}>
            <div className="flex w-80 items-center justify-between border p-5">
              <Link href={`/sessions/${s.id}`}>
                <div className="text-left">
                  <h2 className="text-xl font-bold">{s.title}</h2>
                  <p className="text-sm">{s.description}</p>
                </div>
              </Link>
              <div>
                <DeleteButton id={s.id} table={"sessions"}></DeleteButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
