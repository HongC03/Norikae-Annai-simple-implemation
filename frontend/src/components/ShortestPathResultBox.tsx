import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	Collapse,
	IconButton,
	Paper,
	Stack,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Tooltip,
	Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GetShortestPathResponse } from '../types/GetShortestPathResponse';

type ShortestPathResultBoxProps = {
	activeStationIndex: number;
	setActiveStationIndex: React.Dispatch<React.SetStateAction<number>>;
	shortestPathData: GetShortestPathResponse;
};

const ShortestPathResultBox: React.FC<ShortestPathResultBoxProps> = ({
	activeStationIndex,
	setActiveStationIndex,
	shortestPathData,
}) => {
	const maxStep = shortestPathData.path.length - 1;

	const [expanded, setExpanded] = useState<boolean>(true);

	const expandButtonOnClickHandler = useCallback(() => {
		setExpanded(!expanded);
	}, [expanded, setExpanded]);

	const handleNext = useCallback(() => {
		if (activeStationIndex === maxStep) return;
		setActiveStationIndex((prevActiveStep) => prevActiveStep + 1);
	}, [activeStationIndex, setActiveStationIndex]);

	const handleBack = useCallback(() => {
		if (activeStationIndex === 0) return;
		setActiveStationIndex((prevActiveStep) => prevActiveStep - 1);
	}, [activeStationIndex, setActiveStationIndex]);

	const handleReset = useCallback(() => {
		setActiveStationIndex(0);
	}, [setActiveStationIndex]);

	useEffect(() => {
		handleReset();
	}, [shortestPathData]);

	if (shortestPathData.path.length === 0) return null;

	return (
		<Card
			sx={{
				width: '300px',
				maxHeight: '90%',
				overflowY: 'scroll',
				'&::-webkit-scrollbar': { display: 'none' },
				msOverflowStyle: 'none',
				scrollbarWidth: 'none',
				backgroundColor: 'white',
				padding: '10px',
				position: 'fixed',
				top: '25px',
				right: '25px',
				zIndex: '999',
			}}
		>
			<Box
				display={'flex'}
				flexDirection={'row'}
				justifyContent={'space-between'}
				alignItems={'center'}
				padding={'10px 16px 0 16px'}
				sx={{ cursor: 'pointer' }}
				onClick={expandButtonOnClickHandler}
			>
				<Typography sx={{ fontSize: 17 }}>最短路線</Typography>
				<Stack>
					<Typography sx={{ fontSize: 14 }}>
						距離: {Math.round(shortestPathData.totalDistanceKm * 10) / 10}km
					</Typography>
					<Typography sx={{ fontSize: 14 }}>
						所要時間:{' '}
						{Math.round(shortestPathData.totalTravelTimeMinute * 10) / 10}分
					</Typography>
				</Stack>

				<IconButton disableRipple>
					<ExpandMoreIcon />
				</IconButton>
			</Box>
			<Collapse in={expanded} timeout='auto' unmountOnExit>
				<Box
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'ArrowDown') {
							handleNext();
						} else if (e.key === 'ArrowUp') {
							handleBack();
						}
					}}
					sx={{
						'&:focus': {
							outline: 'none',
						},
					}}
				>
					<CardContent>
						<Stepper activeStep={activeStationIndex} orientation='vertical'>
							{shortestPathData.path.map((station) => (
								<Step key={station.stationName}>
									<StepLabel>{station.stationNameJp}</StepLabel>
									<StepContent>
										<Box sx={{ mb: 2 }}>
											<div>
												{activeStationIndex !== maxStep && (
													<Tooltip
														title="Press '↓' to go to next station"
														arrow
													>
														<Button
															variant='contained'
															onClick={handleNext}
															sx={{ mt: 1, mr: 1 }}
														>
															次の駅
														</Button>
													</Tooltip>
												)}
												{activeStationIndex !== 0 && (
													<Tooltip
														title="Press '↑' to go to last station"
														arrow
													>
														<Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
															前の駅
														</Button>
													</Tooltip>
												)}
											</div>
										</Box>
									</StepContent>
								</Step>
							))}
						</Stepper>
						{activeStationIndex === shortestPathData.path.length - 1 && (
							<Paper square elevation={0}>
								<Button onClick={handleReset}>重設</Button>
							</Paper>
						)}
					</CardContent>
				</Box>
			</Collapse>
		</Card>
	);
};

export default ShortestPathResultBox;
