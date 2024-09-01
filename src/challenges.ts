import { Challenge } from './types';

export const TSPChallenges: Record<string, Challenge> = {
  triangleChallenge: {
    name: "Triangle Tour - Very Easy",
    difficulty: "Very Easy",
    cities: [
      { x: 0.2, y: 0.2, name: "A" },
      { x: 0.8, y: 0.2, name: "B" },
      { x: 0.5, y: 0.8, name: "C" }
    ]
  },
  squareChallenge: {
    name: "Square Route - Easy",
    difficulty: "Easy",
    cities: [
      { x: 0.2, y: 0.2, name: "NW" },
      { x: 0.8, y: 0.2, name: "NE" },
      { x: 0.2, y: 0.8, name: "SW" },
      { x: 0.8, y: 0.8, name: "SE" }
    ]
  },
  miniUSA: {
    name: "Mini USA - Easy",
    difficulty: "Easy",
    cities: [
      { x: 0.17, y: 0.67, name: "Seattle" },
      { x: 0.33, y: 1.00, name: "Los Angeles" },
      { x: 0.75, y: 0.94, name: "Miami" },
      { x: 0.83, y: 0.44, name: "New York" },
      { x: 0.50, y: 0.56, name: "Denver" }
    ]
  },
  westernEurope: {
    name: "Western Europe - Medium",
    difficulty: "Medium",
    cities: [
      { x: 0.45, y: 0.50, name: "Paris" },
      { x: 0.55, y: 0.45, name: "Berlin" },
      { x: 0.60, y: 0.70, name: "Rome" },
      { x: 0.40, y: 0.30, name: "London" },
      { x: 0.30, y: 0.60, name: "Madrid" },
      { x: 0.65, y: 0.55, name: "Vienna" }
    ]
  },
  asianCapitals: {
    name: "Asian Capitals - Medium",
    difficulty: "Medium",
    cities: [
      { x: 0.80, y: 0.30, name: "Beijing" },
      { x: 0.90, y: 0.70, name: "Tokyo" },
      { x: 0.70, y: 0.80, name: "Bangkok" },
      { x: 0.60, y: 0.60, name: "New Delhi" },
      { x: 0.50, y: 0.70, name: "Singapore" },
      { x: 0.75, y: 0.50, name: "Seoul" }
    ]
  },
  southAmerica: {
    name: "South American Adventure - Hard",
    difficulty: "Hard",
    cities: [
      { x: 0.40, y: 0.70, name: "Rio de Janeiro" },
      { x: 0.35, y: 0.60, name: "São Paulo" },
      { x: 0.30, y: 0.40, name: "Bogotá" },
      { x: 0.25, y: 0.50, name: "Lima" },
      { x: 0.45, y: 0.85, name: "Buenos Aires" },
      { x: 0.35, y: 0.80, name: "Santiago" },
      { x: 0.40, y: 0.30, name: "Caracas" }
    ]
  },
  africanSafari: {
    name: "African Safari - Hard",
    difficulty: "Hard",
    cities: [
      { x: 0.70, y: 0.60, name: "Cairo" },
      { x: 0.55, y: 0.70, name: "Nairobi" },
      { x: 0.45, y: 0.80, name: "Johannesburg" },
      { x: 0.30, y: 0.65, name: "Lagos" },
      { x: 0.40, y: 0.40, name: "Casablanca" },
      { x: 0.60, y: 0.50, name: "Addis Ababa" },
      { x: 0.50, y: 0.90, name: "Cape Town" }
    ]
  },
  worldTour: {
    name: "World Tour - Very Hard",
    difficulty: "Very Hard",
    cities: [
      { x: 0.20, y: 0.30, name: "New York" },
      { x: 0.40, y: 0.70, name: "Rio de Janeiro" },
      { x: 0.55, y: 0.45, name: "London" },
      { x: 0.70, y: 0.60, name: "Cairo" },
      { x: 0.80, y: 0.30, name: "Moscow" },
      { x: 0.90, y: 0.70, name: "Tokyo" },
      { x: 0.30, y: 0.80, name: "Sydney" },
      { x: 0.10, y: 0.50, name: "Los Angeles" },
      { x: 0.60, y: 0.20, name: "Stockholm" }
    ]
  },
  globalMetropolis: {
    name: "Global Metropolis - Extreme",
    difficulty: "Extreme",
    cities: [
      { x: 0.20, y: 0.30, name: "New York" },
      { x: 0.40, y: 0.70, name: "São Paulo" },
      { x: 0.55, y: 0.45, name: "London" },
      { x: 0.70, y: 0.60, name: "Cairo" },
      { x: 0.80, y: 0.30, name: "Moscow" },
      { x: 0.90, y: 0.70, name: "Tokyo" },
      { x: 0.30, y: 0.80, name: "Sydney" },
      { x: 0.10, y: 0.50, name: "Los Angeles" },
      { x: 0.60, y: 0.20, name: "Stockholm" },
      { x: 0.50, y: 0.50, name: "Dubai" },
      { x: 0.75, y: 0.75, name: "Singapore" },
      { x: 0.25, y: 0.60, name: "Mexico City" }
    ]
  },
  worldCapitals: {
    name: "World Capitals - Extreme",
    difficulty: "Extreme",
    cities: [
      { x: 0.20, y: 0.30, name: "Washington D.C." },
      { x: 0.40, y: 0.70, name: "Brasília" },
      { x: 0.55, y: 0.45, name: "London" },
      { x: 0.70, y: 0.60, name: "Cairo" },
      { x: 0.80, y: 0.30, name: "Moscow" },
      { x: 0.90, y: 0.70, name: "Tokyo" },
      { x: 0.30, y: 0.80, name: "Canberra" },
      { x: 0.10, y: 0.50, name: "Mexico City" },
      { x: 0.60, y: 0.20, name: "Stockholm" },
      { x: 0.50, y: 0.50, name: "New Delhi" },
      { x: 0.75, y: 0.75, name: "Jakarta" },
      { x: 0.25, y: 0.60, name: "Pretoria" },
      { x: 0.65, y: 0.35, name: "Berlin" },
      { x: 0.45, y: 0.25, name: "Ottawa" }
    ]
  }
};