"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { buttonVariants } from "./ui/button";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

export const ToggleMobileMenu = createContext<
  Dispatch<SetStateAction<boolean>>
>(() => {});

export default function MobileNavMenu({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  const Socials = () => (
    <div className="mt-auto flex items-center">
      <span className="text-muted-foreground">Follow me on</span>
      <Link
        href={"https://x.com/chadnicu"}
        target="_blank"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <svg
          className="fill-current h-[1.1rem] w-[1.1rem]"
          viewBox="0 0 1200 1227"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
        </svg>
      </Link>
      <span className="text-muted-foreground">and</span>
      <Link
        href={"https://github.com/chadnicu"}
        target="_blank"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <GitHubLogoIcon className="w-[1.2rem] h-[1.2rem]" />
      </Link>
    </div>
  );

  return (
    <Sheet open={open && !isDesktop} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
        <HamburgerMenuIcon className="w-[1.2rem] h-[1.2rem]" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col space-around sm:hidden"
      >
        <SheetHeader className="text-left mb-2">
          <SheetTitle className="tracking-tighter text-2xl">
            TrainSync
          </SheetTitle>
          {/* <SheetDescription></SheetDescription> */}
        </SheetHeader>
        <ToggleMobileMenu.Provider value={setOpen}>
          {children}
        </ToggleMobileMenu.Provider>
        <Socials />
      </SheetContent>
    </Sheet>
  );
}
