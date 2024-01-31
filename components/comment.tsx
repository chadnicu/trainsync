import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ReactNode } from "react";

export default function CommentAlert({
  children,
  title,
  className,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <Alert className={className}>
      <ChatBubbleIcon className="h-4 w-4" />
      <AlertTitle>{title ?? "Comment"}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
