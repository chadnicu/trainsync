import { frameworks } from "@/lib/schema";
import { db } from "@/lib/turso";
import Link from "next/link";

export default async function Home() {
  const res = await db.select().from(frameworks).all();

  return (
    <main className="grid container p-10 min-h-screen gap-10">
      {res.map((e) => {
        const { id, name, language, url, stars } = {
          ...e,
          url: e.url.slice(1, e.url.length - 1),
        };
        return (
          <div key={id}>
            <h2>{name}</h2>
            <p>{language}</p>
            <Link target="_blank" href={url}>
              {url}
            </Link>
            <p>{stars} stars</p>
          </div>
        );
      })}
    </main>
  );
}
