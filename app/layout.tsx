import "@/styles/globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import MainNavbar from "@/components/main-nav";
import MainFooter from "@/components/main-footer";

// remove if no need for inter
// import { Inter as FontSans } from "next/font/google";
// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata: Metadata = {
  title: "Change this later",
  description: "This too",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.className,
          "min-h-screen flex flex-col justify-between bg-background antialiased leading-tight lg:leading-[1.1] gap-10"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNavbar />
          <main className="container h-full">{children}</main>
          <MainFooter/>
        </ThemeProvider>
      </body>
    </html>
  );
}
