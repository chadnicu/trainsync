import Logs from "./Logs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logs",
};

export default function Page() {
  return (
    <>
      <h1 className="text-center text-5xl font-bold">Logs</h1>
      <Logs />
    </>
  );
}
