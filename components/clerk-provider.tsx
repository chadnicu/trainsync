import { ClerkProvider as AsyncClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import type { IsomorphicClerkOptions } from "@clerk/clerk-react";
import type { PublishableKeyOrFrontendApi } from "@clerk/types";
import React from "react";

type NextAppClerkProviderProps = React.PropsWithChildren<
  Omit<IsomorphicClerkOptions, keyof PublishableKeyOrFrontendApi> &
    Partial<PublishableKeyOrFrontendApi>
>;

export default function ClerkProvider({
  children,
  className,
  ...props
}: NextAppClerkProviderProps & { className: string }) {
  return (
    <Suspense fallback={<p>Loading clerk..</p>}>
      <AsyncClerkProvider {...props}>
        <div className={className}>{children}</div>
      </AsyncClerkProvider>
    </Suspense>
  );
}
