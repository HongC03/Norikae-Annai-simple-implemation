import MapComponent from '../components/MapComponent';
import { useCallback, useState } from 'react';
import { StationSearchOption } from '../components/StationSearchAutoComplete';
import {
	GetShortestPathResponse,
	emptyGetShortestPathResponse,
} from '../types/GetShortestPathResponse';
import StationSearchBox from '../components/StationSearchBox';
import ShortestPathResultBox from '../components/ShortestPathResultBox';

const HomePage = () => {
	const [fromStation, setFromStation] = useState<StationSearchOption | null>(
		null
	);
	const [toStation, setToStation] = useState<StationSearchOption | null>(null);
	const [activeStationIndex, setActiveStationIndex] = useState<number>(0);
	const [shortestPathData, setShortestPathData] =
		useState<GetShortestPathResponse>(emptyGetShortestPathResponse);
	const setFromStationHandler = useCallback(
		(fromStation: StationSearchOption | null) => setFromStation(fromStation),
		[]
	);
	const setToStationHandler = useCallback(
		(toStation: StationSearchOption | null) => setToStation(toStation),
		[]
	);
	const setActiveStationIndexHandler = useCallback(setActiveStationIndex, []);

	const setShortestPathDataHandler = useCallback(
		(shortestPathData: GetShortestPathResponse) =>
			setShortestPathData(shortestPathData),
		[]
	);

	return (
		<div className='App'>
			<StationSearchBox
				fromStation={fromStation}
				setFromStation={setFromStationHandler}
				toStation={toStation}
				setToStation={setToStationHandler}
				setShortestPathData={setShortestPathDataHandler}
			/>
			<ShortestPathResultBox
				activeStationIndex={activeStationIndex}
				setActiveStationIndex={setActiveStationIndexHandler}
				shortestPathData={shortestPathData}
			/>
			<MapComponent
				activeStationIndex={activeStationIndex}
				shortestPathData={shortestPathData}
			/>
		</div>
	);
};

export default HomePage;
