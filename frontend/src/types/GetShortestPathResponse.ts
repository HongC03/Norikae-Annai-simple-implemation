import { GetStationsResponse } from "./GetStationsResponse";

export interface GetShortestPathResponse {
  path: GetStationsResponse[];
  totalTravelTimeMinute: number;
  totalDistanceKm: number;
}

export const emptyGetShortestPathResponse: GetShortestPathResponse = {
  path: [],
  totalTravelTimeMinute: 0,
  totalDistanceKm: 0,
};
