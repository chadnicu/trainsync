import { getIdFromSlug } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getSetsByExerciseId } from "@/server/sets";
import { queryKeys } from "@/lib/query-keys";

export function useExerciseSets() {
  const params = useParams<{ slug: string }>();
  const exerciseId = getIdFromSlug(params.slug);
  return useQuery({
    queryKey: queryKeys.exerciseSets(exerciseId),
    queryFn: async () => getSetsByExerciseId(exerciseId),
    initialData: [],
  });
}
