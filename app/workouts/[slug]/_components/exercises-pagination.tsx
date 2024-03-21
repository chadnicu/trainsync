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
import { usePathname, useSearchParams } from "next/navigation";

export default function ExercisesPagination({ length }: { length: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = parseInt(searchParams.get("exercise") ?? "1", 10);
  const next = current < length ? current + 1 : current;
  const prev = current > 1 ? current - 1 : current;

  const magicNumber = useMediaQuery("(min-width: 450px)") ? 5 : 3;
  if (!length) return <H4>You have no exercises</H4>;
  // const magicNumber = 5;

  const PaginationLinks = () => {
    let amount: number;
    if (current < 3) {
      amount = 0;
    } else if (current >= length - 1) {
      amount = current - (magicNumber - (length - current));
    } else {
      amount = current - (magicNumber === 5 ? 3 : 2);
    }

    return Array.from({ length }, (_, i) => {
      ++i;
      return (
        <PaginationItem key={i}>
          <PaginationLink
            key={i}
            href={pathname + "?exercise=" + i}
            isActive={current === i}
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
          <PaginationPrevious href={pathname + "?exercise=" + prev} />
        </PaginationItem>
        <PaginationLinks />
        <PaginationItem>
          <PaginationNext href={pathname + "?exercise=" + next} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
