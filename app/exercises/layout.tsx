import ExerciseForm from "@/components/ExerciseForm";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid p-10 md:flex md:flex-row-reverse md:justify-between">
      <ExerciseForm />
      {children}
    </div>
  );
}
