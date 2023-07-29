export type Exercise = {
  id: number;
  title: string;
  instructions: string | null;
  url: string | null;
  userId: string;
};

export type Template = {
  id: number;
  title: string;
  description: string | null;
  userId: string;
};

export type Workout = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  started: string | null;
  finished: string | null;
  comment: string | null;
  userId: string;
};

export type Set = {
  id: number;
  reps: number | null;
  weight: number | null;
  userId: string;
  workoutExerciseId: number;
};
