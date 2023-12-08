import { ReactNode } from "react";
import { ClerkAsyncProvider } from "./server";
import { NextThemeProvider, TanstackQueryProvider } from "./client";

export default function Providers({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ClerkAsyncProvider>
      <TanstackQueryProvider>
        <NextThemeProvider>
          <div className={className}>{children}</div>
        </NextThemeProvider>
      </TanstackQueryProvider>
    </ClerkAsyncProvider>
  );
}
