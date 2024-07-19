import React, { useMemo } from 'react';
import {
	Autocomplete,
	AutocompleteRenderInputParams,
	TextField,
} from '@mui/material';
import { useCallback } from 'react';
import useGetStations from '../hooks/useGetStations';

type StationSearchAutoCompleteProp = {
	id: string;
	label: string;
	value: StationSearchOption | null;
	setValue: (newValue: StationSearchOption | null) => void;
};

export type StationSearchOption = {
	railwayLine: string;
	stationName: string;
	stationNameJp: string;
};

const StationSearchAutoComplete: React.FC<StationSearchAutoCompleteProp> =
	React.memo(({ id, label, value, setValue }) => {
		const { stationsData } = useGetStations();
		const stationsOptionData: StationSearchOption[] = useMemo(() => {
			return (
				stationsData?.map((station) => {
					const { stationName, stationNameJp } = station;
					const start = stationNameJp.indexOf('(') + 1;
					const end = stationNameJp.indexOf(')');
					const railwayLine = stationNameJp.slice(start, end);
					return {
						railwayLine: railwayLine,
						stationName: stationName,
						stationNameJp: stationNameJp,
					};
				}) || []
			);
		}, [stationsData]);

		const onChangeHandler = (_: any, newValue: StationSearchOption | null) => {
			setValue(newValue);
		};

		const renderInput = useCallback(
			(params: AutocompleteRenderInputParams) => (
				<TextField {...params} label={label} />
			),
			[label]
		);

		return (
			<Autocomplete
				disablePortal
				id={id}
				options={stationsOptionData.sort((a, b) =>
					a.railwayLine.localeCompare(b.railwayLine)
				)}
				sx={{ width: '100%', height: '50px' }}
				value={value}
				onChange={onChangeHandler}
				groupBy={(option) => option.railwayLine}
				getOptionLabel={(option) => option.stationNameJp}
				isOptionEqualToValue={(option, value) =>
					option.stationName === value.stationName
				}
				renderInput={renderInput}
			/>
		);
	});

export default StationSearchAutoComplete;
