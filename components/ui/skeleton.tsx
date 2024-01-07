import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // changed to span w/ display:block so I can render inside <p>'s
    <span
      className={cn(
        "block animate-pulse rounded-md bg-primary/10 text-transparent selection:text-transparent",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
