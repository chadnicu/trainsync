import ExerciseForm from "@/components/ExerciseForm";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:flex md:flex-row-reverse md:justify-between p-10">
      <ExerciseForm />
      {children}
    </div>
  );
}
