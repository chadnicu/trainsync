import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { buttonVariants } from "./ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function MobileNavMenu({ children }: { children?: ReactNode }) {
  return (
    <Sheet>
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
        {children}
      </SheetContent>
    </Sheet>
  );
}
