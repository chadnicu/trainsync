import { ClerkProvider } from "@clerk/nextjs";
import ClientProviders from "./clientProviders";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ClientProviders>{children}</ClientProviders>
    </ClerkProvider>
  );
}
