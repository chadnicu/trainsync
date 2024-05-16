import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import MainNavbar from "@/components/main-nav";
import MainFooter from "@/components/main-footer";
import ClerkProvider from "@/components/clerk-provider";
import { TanstackQueryProvider } from "@/components/query-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trainsync.online/"),
  title: "TrainSync - The Web Based Workout Tracker",
  description:
    "TrainSync is a the simple, functional and completely free workout tracker for the web, designed to help you achieve your lifting goals more efficiently.",
  generator: "Next.js",
  applicationName: "TrainSync",
  referrer: "origin-when-cross-origin",
  keywords: [
    "TrainSync",
    "Workout Tracker",
    "Workout",
    "Tracker",
    "Fitness",
    "Logger",
    "Sets",
    "Reps",
    "Exercises",
    "App",
    "Web",
    "Train",
    "Sync",
  ],
  authors: [{ name: "Nicu", url: "https://twitter.com/chadnicu" }],
  creator: "Onța Nicolae",
  publisher: "Onța Nicolae",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TrainSync",
    description:
      "TrainSync is a the simple, functional and completely free workout tracker for the web, designed to help you achieve your lifting goals more efficiently.",
    url: "https://trainsync.online",
    siteName: "TrainSync",
    images: [
      {
        url: "https://www.trainsync.online/opengraph-image", // Must be an absolute URL
        width: 1800,
        height: 1600,
      },
      {
        url: "https://www.trainsync.online/opengraph-image", // Must be an absolute URL
        width: 800,
        height: 600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrainSync",
    description:
      "TrainSync is a the simple, functional and completely free workout tracker for the web, designed to help you achieve your lifting goals more efficiently",
    siteId: "1132731405539188736",
    creator: "@chadnicu",
    creatorId: "1132731405539188736",
    images: ["https://trainsync.online/opengraph-image"], // Must be an absolute URL
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ScrollArea className="h-screen w-screen no-padding">
          <ClerkProvider className="min-h-screen flex flex-col justify-between bg-background antialiased leading-tight lg:leading-[1.1] gap-10">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TanstackQueryProvider>
                <MainNavbar />
                <main className="sm:container px-[0.9rem]">{children}</main>
                <MainFooter />
              </TanstackQueryProvider>
            </ThemeProvider>
          </ClerkProvider>
        </ScrollArea>
        <Toaster />
      </body>
    </html>
  );
}
