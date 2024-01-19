import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";

export const ToggleDialogFunction = createContext<
  Dispatch<SetStateAction<boolean>>
>(() => {});

export default function ResponsiveFormDialog({
  trigger,
  title,
  description,
  children,
  popoverContent,
}: {
  trigger: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  popoverContent?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          <ToggleDialogFunction.Provider value={setOpen}>
            {children}
          </ToggleDialogFunction.Provider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        {(title || description) && (
          <DrawerHeader className="text-left px-6">
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className="px-6">
          <ToggleDialogFunction.Provider value={setOpen}>
            {children}
          </ToggleDialogFunction.Provider>
        </div>
        <DrawerFooter className="pt-2 px-6">
          <DrawerClose asChild>
            <Button variant="outline" className="w-fit -mt-11 ml-1 z-10">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
