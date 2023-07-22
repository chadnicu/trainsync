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
