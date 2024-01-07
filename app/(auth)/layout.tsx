export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-fit mx-auto">{children}</section>;
}
