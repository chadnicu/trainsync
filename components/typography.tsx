import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function H1({ className, children, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-5xl font-extrabold tracking-tighter lg:text-6xl text-gradient",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tighter first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-bold tracking-tighter text-gradient",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ className, children, ...props }: ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tighter",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function P({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function Blockquote({
  className,
  children,
  ...props
}: ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function InlineCode({
  className,
  children,
  ...props
}: ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export function A({ className, children, ...props }: ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "hover:underline underline-offset-2 focus:underline active:brightness-75 duration-200 flex items-center justify-start gap-1",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// cant use this in above components because classes get purged if unused
// might find a fix in the future
const variants = {
  h1: "scroll-m-20 text-5xl font-extrabold tracking-tighter lg:text-6xl text-gradient",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tighter first:mt-0",
  h3: "scroll-m-20 text-2xl font-bold tracking-tighter text-gradient",
  h4: "scroll-m-20 text-xl font-semibold tracking-tighter",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  "inline-code":
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  a: "hover:underline underline-offset-2 focus:underline active:brightness-75 duration-200 flex items-center justify-start gap-1 text-gradient",
};

export const typography = (element: keyof typeof variants) => variants[element];
