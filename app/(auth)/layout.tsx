export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="absolute grid place-items-center inset-0 m-auto">
      {children}
    </section>
  );
}
