import { usePathname } from "next/navigation";
import { P } from "./typography";

export default function EmptyArray() {
  const pathname = usePathname();

  return (
    <P className="text-center md:ml-16 text-muted-foreground">
      Looks like you have no {pathname.split("/")[1]}. Click create to add some!
    </P>
  );
}
