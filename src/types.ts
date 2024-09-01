export interface City {
  x: number;
  y: number;
  name: string;
  color?: string;
}

export type Challenge = {
  name: string;
  difficulty: "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard" | "Extreme";
  cities: City[];
};
