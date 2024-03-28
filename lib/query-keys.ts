const exercises = "exercises",
  workouts = "workouts",
  templates = "templates",
  sets = "sets";

export const queryKeys = {
  exercises: [exercises],
  exercise: (exerciseId: number) => [exercises, { exerciseId }],
  // exerciseSets: (exerciseId: number) => [sets, { exerciseId }],

  workouts: [workouts],
  workout: (workoutId: number) => [workouts, { workoutId }],
  workoutExercises: (workoutId: number) => [exercises, { workoutId }],
  // workoutSets: (workoutId: number) => [sets, { workoutId }],

  templates: [templates],
  template: (templateId: number) => [templates, { templateId }],
  templateExercises: (templateId: number) => [templates, { templateId }],

  sets: [sets],
};
