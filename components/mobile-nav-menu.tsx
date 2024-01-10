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
  useState,
} from "react";
import { buttonVariants } from "./ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export const ToggleMobileMenu = createContext<
  Dispatch<SetStateAction<boolean>>
>(() => {});

export default function MobileNavMenu({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
        <HamburgerMenuIcon className="w-[1.2rem] h-[1.2rem]" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="text-left mb-2">
          <SheetTitle className="tracking-tighter text-2xl">
            TrainSync
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <ToggleMobileMenu.Provider value={setOpen}>
          {children}
        </ToggleMobileMenu.Provider>
      </SheetContent>
    </Sheet>
  );
}
