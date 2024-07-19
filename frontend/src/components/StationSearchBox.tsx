import React, { useCallback } from 'react';
import { FlipCameraAndroid } from '@mui/icons-material';
import { Stack, IconButton, Button, Box } from '@mui/material';
import StationSearchAutoComplete, {
	StationSearchOption,
} from './StationSearchAutoComplete';
import useGetShortestPath from '../hooks/useGetShortestPath';
import { GetShortestPathResponse } from '../types/GetShortestPathResponse';

type StationSearchBoxProps = {
	fromStation: StationSearchOption | null;
	setFromStation: (val: StationSearchOption | null) => void;
	toStation: StationSearchOption | null;
	setToStation: (val: StationSearchOption | null) => void;
	setShortestPathData: (val: GetShortestPathResponse) => void;
};

const StationSearchBox: React.FC<StationSearchBoxProps> = React.memo(
	({
		fromStation,
		setFromStation,
		toStation,
		setToStation,
		setShortestPathData,
	}) => {
		const { getShortestPath } = useGetShortestPath({
			fromStation: fromStation?.stationName || '',
			toStation: toStation?.stationName || '',
			onSuccess: (data) => {
				setShortestPathData(data);
			},
		});

		const reverseButtonOnClick = useCallback(() => {
			if (fromStation == null || toStation == null) return;
			const toStationTemp = toStation;
			setToStation(fromStation);
			setFromStation(toStationTemp);
		}, [fromStation, setFromStation, toStation, setToStation]);

		return (
			<Box
				sx={{
					width: 'clamp(300px, 100%, 400px)',
					height: '165px',
					backgroundColor: 'white',
					borderRadius: '5px',
					padding: '15px',
					position: 'fixed',
					top: '25px',
					left: '25px',
					zIndex: '999',
					boxShadow:
						'0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)',
				}}
			>
				<Stack>
					<Stack direction={'row'} gap={'10px'}>
						<Stack spacing={'15px'} sx={{ width: '85%' }}>
							<StationSearchAutoComplete
								id='from-station-search-box'
								label='出発駅'
								value={fromStation}
								setValue={setFromStation}
							/>
							<StationSearchAutoComplete
								id='to-station-search-box'
								label='到着駅'
								value={toStation}
								setValue={setToStation}
							/>
						</Stack>
						<Stack alignContent={'center'}>
							<IconButton
								sx={{ height: '40px', margin: 'auto' }}
								onClick={reverseButtonOnClick}
							>
								<FlipCameraAndroid />
							</IconButton>
						</Stack>
					</Stack>
					<SearchButton onClick={getShortestPath} />
				</Stack>
			</Box>
		);
	}
);

type SearchButtonProps = {
	onClick: () => void;
};

const SearchButton: React.FC<SearchButtonProps> = React.memo(({ onClick }) => {
	return (
		<Button
			sx={{ marginTop: '15px', width: '40px', alignSelf: 'end' }}
			onClick={onClick}
		>
			検索
		</Button>
	);
});

export default StationSearchBox;
