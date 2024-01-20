import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

export default function ExercisesPagination({ length }: { length: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = parseInt(searchParams.get("exercise") ?? "1", 10);
  const next = current < length ? current + 1 : current;
  const prev = current > 1 ? current - 1 : current;

  const PaginationLinks = () => {
    let amount: number;
    if (current <= 3) {
      amount = 0;
    } else if (current >= length - 2) {
      amount = current - (5 - (length - current));
    } else {
      amount = current - 3;
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
    }).splice(amount, 5);
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
