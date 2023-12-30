import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode, Suspense } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { getLogs, getTemplates, getWorkouts } from "./actions";
import { dark } from "@clerk/themes";
import LoadingPage from "@/components/LoadingPage";
import { ClerkProvider } from "@clerk/nextjs";
import {
  NextThemeProvider,
  TanstackQueryProvider,
} from "@/app/client-side-providers";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/hooks/get-query-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://trainsync.vercel.app"),
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
  verification: { google: "RyOELjHapTTX8egYZHTY5ZIdJO47EPgiddC4u4qVOq8" },
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
        <Suspense fallback={<LoadingPage text="Clerk.." />}>
          <ClerkProvider appearance={{ baseTheme: dark }}>
            <TanstackQueryProvider>
              <NextThemeProvider>
                <div className="grid min-h-screen items-start">
                  <Suspense fallback={<Navbar />}>
                    <NavbarWithData />
                  </Suspense>
                  <div>
                    {children}
                    <Toaster />
                    <Analytics />
                    <SpeedInsights />
                  </div>
                </div>
              </NextThemeProvider>
            </TanstackQueryProvider>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}

async function NavbarWithData() {
  const queryClient = getQueryClient();
  const prefetchFunctions = [
    (async () =>
      await queryClient.prefetchQuery({
        queryKey: ["logs"],
        queryFn: getLogs,
      }))(),
    (async () =>
      await queryClient.prefetchQuery({
        queryKey: ["templates"],
        queryFn: getTemplates,
      }))(),
    (async () =>
      await queryClient.prefetchQuery({
        queryKey: ["workouts"],
        queryFn: getWorkouts,
      }))(),
  ];
  await Promise.all(prefetchFunctions);
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Navbar />
    </Hydrate>
  );
}
