import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { buttonVariants } from "./ui/button";

export default function MobileNavMenu({ children }: { children?: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
        Menu
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
