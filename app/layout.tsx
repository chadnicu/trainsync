import "./globals.css";
import Providers from "../providers/providers";
import Navbar from "@/components/Navbar";
import NavbarSkeleton from "@/components/NavbarSkeleton";
import { ReactNode, Suspense } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { getLogs, getTemplates, getWorkouts } from "@/app/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://trainsync.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },

  title: "TrainSync - The best way to track your workouts",
  description:
    "TrainSync is a free and open source app for tracking your lifts, allowing you to train smarter and more efficiently.",
  applicationName: "TrainSync",
  authors: { name: "iusedebian", url: "https://twitter.com/iusedebian" },
  creator: "Onța Nicolae",
  // openGraph: {
  //   images: "/api",
  // },
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "tracking-tight")}>
        <Providers className="grid min-h-screen items-start ">
          <Suspense fallback={<NavbarSkeleton />}>
            <AsyncNavbar />
          </Suspense>
          <div>
            {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </div>
        </Providers>
      </body>
    </html>
  );
}

async function AsyncNavbar() {
  const [templates, workouts, logs] = await Promise.all([
    getTemplates(),
    getWorkouts(),
    getLogs(),
  ]);

  return (
    <Navbar
      initialTemplates={templates}
      initialWorkouts={workouts}
      initialLogs={logs}
    />
  );
}
