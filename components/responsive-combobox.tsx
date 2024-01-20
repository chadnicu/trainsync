"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";

type Data = { id: number; title: string };

type Props = {
  trigger: React.ReactNode;
  data: Data[];
  placeholder?: string;
  mutate: ({ exerciseId }: { exerciseId: number }) => void;
};

export function ResponsiveComboBox({
  trigger,
  data,
  placeholder,
  mutate,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Data | null>(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const DataCommand = () => (
    <Command className="p-4 md:p-0">
      <CommandInput placeholder={placeholder ?? "Search.."} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup className="overflow-hidden">
          <ScrollArea className="h-72">
            {data.map(({ id, title }) => (
              <CommandItem
                key={id}
                value={title}
                onSelect={(title) => {
                  mutate({ exerciseId: id });
                  setOpen(false);
                }}
              >
                {title}
              </CommandItem>
            ))}
          </ScrollArea>
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <DataCommand />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DataCommand />
      </DrawerContent>
    </Drawer>
  );
}
