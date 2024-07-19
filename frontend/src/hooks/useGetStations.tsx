import { useQuery } from "react-query";
import { request } from "../utils/request";
import { GetStationsResponse } from "../types/GetStationsResponse";

export const getStations = async () => {
  const data = request("/api/v1/stations", {
    method: "GET",
  });
  return data;
};

const getStationsQueryKey: string = "stations";

const useGetStations = () => {
  const { data: stationsData, isLoading } = useQuery<GetStationsResponse[]>({
    queryKey: getStationsQueryKey,
    queryFn: getStations,
    staleTime: Infinity,
  });

  return {
    stationsData,
    isLoading,
  };
};

export default useGetStations;
