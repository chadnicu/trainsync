import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

export type Value = "all" | "default" | "own";

type Props = {
  setter: Dispatch<SetStateAction<Value>>;
};

export function SelectExercises({ setter }: Props) {
  return (
    <Select defaultValue="own" onValueChange={(v) => setter(v as Value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Shouldn't be visible" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Exercises</SelectLabel>
          <SelectItem value="all">All exercises</SelectItem>
          <SelectItem value="default">Default exercises</SelectItem>
          <SelectItem value="own">Created by me</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
