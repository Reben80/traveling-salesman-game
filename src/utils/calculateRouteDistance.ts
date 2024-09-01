import { City } from '../types';

export const calculateRouteDistance = (route: number[], cities: City[]): number => {
  let distance = 0;
  for (let i = 0; i < route.length; i++) {
    const city1 = cities[route[i]];
    const city2 = cities[route[(i + 1) % route.length]];
    const dx = city2.x - city1.x;
    const dy = city2.y - city1.y;
    distance += Math.sqrt(dx ** 2 + dy ** 2);
  }
  return distance;
};