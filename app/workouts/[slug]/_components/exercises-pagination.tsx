import { H4 } from "@/components/typography";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export default function ExercisesPagination({
  length,
  disabled,
}: {
  length: number;
  disabled?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = parseInt(searchParams.get("exercise") ?? "1", 10);
  const next = current < length ? current + 1 : current;
  const prev = current > 1 ? current - 1 : current;

  const magicNumber = useMediaQuery("(min-width: 450px)") ? 5 : 3;
  if (!length) return <H4>You have no exercises</H4>;

  const PaginationLinks = () => {
    let amount: number;
    if (current < (magicNumber === 5 ? 5 : 3)) {
      amount = 0;
    } else if (current >= length - 1) {
      amount = current - (magicNumber - (length - current));
    } else {
      amount = current - (magicNumber === 5 ? 3 : 2);
    }

    // 4 on desktop isnt centered for some reason so i fix it
    if (magicNumber === 5 && current === 4 && length > 5) amount++;

    return Array.from({ length }, (_, i) => {
      ++i;
      return (
        <PaginationItem key={i}>
          <PaginationLink
            key={i}
            href={disabled ? pathname : pathname + "?exercise=" + i}
            isActive={current === i}
            className={cn({
              "opacity-70 hover:bg-transparent pointer-events-none": disabled,
            })}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }).splice(amount, magicNumber);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={disabled ? pathname : pathname + "?exercise=" + prev}
            className={cn({
              "opacity-75 hover:bg-transparent pointer-events-none":
                !!(prev === current) || disabled,
            })}
            aria-disabled={prev === current}
          />
        </PaginationItem>
        <PaginationLinks />
        <PaginationItem>
          <PaginationNext
            href={disabled ? pathname : pathname + "?exercise=" + next}
            className={cn({
              "opacity-75 hover:bg-transparent pointer-events-none":
                !!(prev === current) || disabled,
            })}
            aria-disabled={next === current}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
