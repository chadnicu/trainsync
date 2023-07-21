"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextThemesProvider enableSystem attribute="class" defaultTheme="system">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextThemesProvider>
  );
}
