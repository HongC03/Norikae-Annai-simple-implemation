import { useMutation } from 'react-query';
import { request } from '../utils/request';
import { GetShortestPathResponse } from '../types/GetShortestPathResponse';

export const fetchFindShortestPath = async (
	fromStation: string,
	toStation: string
) => {
	const data = await request(
		`/api/v1/findShortestPath?from=${fromStation}&to=${toStation}`,
		{
			method: 'GET',
		}
	);
	return data;
};

const findShortestPathMutationKey: string = 'findShortestPath';

interface useGetShortestPathArgs {
	fromStation: string;
	toStation: string;
	onSuccess: (data: GetShortestPathResponse) => void;
}
// useMutation is used since getShortestPath doesn't need cache feature and require manual trigger
const useGetShortestPath = ({
	fromStation,
	toStation,
	onSuccess,
}: useGetShortestPathArgs) => {
	const {
		mutate: getShortestPath,
		data: shortestPathData,
		isLoading,
	} = useMutation<GetShortestPathResponse>({
		mutationKey: findShortestPathMutationKey,
		mutationFn: () => fetchFindShortestPath(fromStation, toStation),
		onSuccess: onSuccess,
	});

	return {
		getShortestPath,
		shortestPathData,
		isLoading,
	};
};

export default useGetShortestPath;
