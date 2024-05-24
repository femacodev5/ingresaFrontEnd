import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Container,
	Grid,
	Input,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

import BackspaceIcon from '@mui/icons-material/Backspace';
import DoneIcon from '@mui/icons-material/Done';
import { useTheme } from '@mui/material/styles';

function Ingreso() {
	const theme = useTheme();
	const [value, setValue] = useState(new Date());

	const [dni, setDni] = useState('');
	function addNumberDni(e) {
		if (dni.length === 0) {
			setDni(e.target.value);
		} else {
			setDni((cur) => cur + e.target.value);
		}
	}

	const deleteNumberDni = () => {
		setDni((cur) => cur.slice(0, -1));
	};

	const buttonList = [];
	for (let i = 0; i < 10; i += 1) {
		buttonList.push(
			<Grid item lg={4}>
				<Button
					key={i}
					sx={{ width: '100%' }}
					value={i}
					size="large"
					onClick={(e) => {
						addNumberDni(e);
					}}
				>
					{i}
				</Button>
			</Grid>,
		);
	}
	useEffect(() => {
		const interval = setInterval(() => setValue(new Date()), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<Container maxWidth="xl" fixed>
			<Card>
				<Grid container>
					<Grid xs={12} md={6}>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Typography color="primary" variant="h1" gutterBottom>
								{value.toLocaleTimeString()}
							</Typography>
							<Clock value={value} />
						</Box>
					</Grid>
					<Grid xs={12} md={6}>
						<Input
							inputProps={{
								min: 0,
								style: {
									textAlign: 'center',
									fontSize: theme.typography.h2.fontSize,
									color: theme.palette.primary.main,
								},
							}}
							sx={{ width: '100%', textAlign: 'center' }}
							size="lg"
							placeholder="DNI"
							value={dni}
							onChange={(event) => setDni(event.target.value)}
						/>
						<Grid container spacing={2}>
							{buttonList}
							<Grid lg="4" sx={{ display: 'flex' }} item>
								<Button
									onClick={() => {
										deleteNumberDni();
									}}
									sx={{ width: '100%' }}
									color="error"
									variant="contained"
								>
									<BackspaceIcon />
								</Button>
							</Grid>

							<Grid lg="4" sx={{ display: 'flex' }} item>
								<Button sx={{ width: '100%' }} color="success" variant="contained">
									<DoneIcon />
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Card>
		</Container>
	);
}

export default Ingreso;
