export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid justify-center gap-10 py-10 text-center">
      {children}
    </div>
  );
}
