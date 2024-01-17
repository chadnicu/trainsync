"use client";

import { useQuery } from "@tanstack/react-query";
import { getExercisesByWorkoutId, getWorkoutById } from "./server";

type Props = {
    params: { id: string };
};

export default function Workout({ params: { id } }: Props) {
    const workoutId = parseInt(id, 10);

    const { data: workout } = useQuery({
        queryKey: ["workout", workoutId],
        queryFn: async () => getWorkoutById(workoutId),
    });

    const { data: { inWorkout, other } } = useQuery({
        queryKey: ["exercises", workoutId],
        queryFn: async () => getExercisesByWorkoutId(workoutId),
        initialData: { inWorkout: [], other: [] }
    });

    return (
        <div className="p-20 text-center">
            <h1 className="text-5xl font-bold tracking-tighter">
                Workout {workoutId} - {workout?.title}
            </h1>
            <p>{workout?.description}</p>
            <div>
                in:
                {inWorkout.map((e) => (
                    <div key={e.id}>
                        <h1>{e.title}</h1>
                    </div>
                ))}
                <br />

                other:{other.map((e) => (
                    <div key={e.id}>
                        <h1>{e.title}</h1>
                    </div>
                ))}
            </div>

        </div>
    );
}
