import { useEffect, useRef } from 'react';
import {
	MapContainer,
	TileLayer,
	Marker,
	Polyline,
	ZoomControl,
	Popup,
	useMap,
	Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GetShortestPathResponse } from '../types/GetShortestPathResponse';
import { LatLngExpression } from 'leaflet';
import { GetStationsResponse } from '../types/GetStationsResponse';

type MapComponentProp = {
	activeStationIndex: number;
	shortestPathData: GetShortestPathResponse;
};

const MapComponent: React.FC<MapComponentProp> = ({
	activeStationIndex,
	shortestPathData,
}) => {
	const polyline = shortestPathData.path.map((station) => [
		station.latitude,
		station.longitude,
	]) as [number, number][];

	const initialMapCenter: LatLngExpression = [
		35.681391, 139.766084,
	] as LatLngExpression;

	const markersRef = useRef<(L.Marker | null)[]>([]);

	useEffect(() => {
		if (!markersRef.current[activeStationIndex]) return;
		markersRef.current[activeStationIndex]?.openPopup();
	}, [activeStationIndex]);

	return (
		<MapContainer
			center={initialMapCenter}
			zoom={13}
			zoomControl={false}
			zoomAnimation={true}
			style={{ width: '100%', height: '100vh' }}
		>
			<ChangeMapCenterTool
				zoom={14}
				activeStationIndex={activeStationIndex}
				shortestPathData={shortestPathData}
			/>
			<TileLayer
				url='https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'
				attribution='Google Maps'
			/>
			{shortestPathData.path.map((station, idx) => (
				<Marker
					key={idx}
					position={[station.latitude, station.longitude]}
					ref={(el) => (markersRef.current[idx] = el)}
				>
					<Popup>{station.stationNameJp}</Popup>
					{idx === 0 && <Tooltip permanent>出発駅</Tooltip>}
					{idx === shortestPathData.path.length - 1 && (
						<Tooltip permanent>到着駅</Tooltip>
					)}
				</Marker>
			))}
			<Polyline positions={polyline} color='blue' />
			<ZoomControl position='bottomright' />
		</MapContainer>
	);
};

type ChangeMapCenterToolProps = {
	zoom: number;
	activeStationIndex: number;
	shortestPathData: GetShortestPathResponse;
};

const ChangeMapCenterTool: React.FC<ChangeMapCenterToolProps> = ({
	zoom,
	activeStationIndex,
	shortestPathData,
}) => {
	const map = useMap();

	useEffect(() => {
		if (shortestPathData.path.length == 0 || !map) return;

		const currentStation: GetStationsResponse =
			shortestPathData.path[activeStationIndex];
		const { latitude, longitude } = currentStation;

		const mapCenter = [latitude, longitude] as LatLngExpression;
		map.flyTo(mapCenter, zoom);
	}, [activeStationIndex, shortestPathData]);

	return null;
};

export default MapComponent;
