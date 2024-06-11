import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Clock from 'react-clock';
import dayjs from 'dayjs';
import personService from '@/services/personService';
import * as registroAnimation from './registros.json';
import * as feriadoAnimation from './vacaciones.json';

import Lottie from 'react-lottie-player';

import swal from 'sweetalert';

const styles = {
	cardferiado: {},
	text: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		marginTop: 10,
		marginBottom: 10,
	},
	container: {
		backgroundColor: '#C8E2',
		height: 200,
		zIndex: 100,
		position: 'relative',
		justifyContent: 'center',
		fontWeight: 'bold',
	},
	centerText: {
		fontWeight: 'bold',
		position: 'absolute',
		top: '50%',
		left: 0,
		zIndex: 100,
		color: '#1a1f1e',
		fontSize: 16,
		marginTop: -2,
	},
	topText: {
		fontWeight: 'bold',
		position: 'absolute',
		top: -8,
		zIndex: 100,
		left: 0,
		color: '#1a1f1e',
		fontSize: 16,
	},
	bottomText: {
		position: 'absolute',
		zIndex: 100,
		fontWeight: 'bold',
		bottom: -8,
		left: 0,
		color: '#1a1f1e',
		fontSize: 16,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 0,
		padding: 10,
		margin: 0,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		alignItems: 'center',
	},
	timeText: {
		fontSize: 20,
		color: '#333',
	},
};

function FichaTurno({ data, reset }) {
	const guardarMarcacion = async () => {
		reset(false);

		const response = await personService.guardarMarcacion({
			empId: data?.empId,
			date: dayjs().format('YYYY-MM-DD'),
			hour: dayjs().format('HH:mm:ss'),
			type: data?.dataButton?.tipo,
		});

		if (response) {
			swal('Genial', 'Se registro tu Marcacion', 'success');
		} else {
			swal('Hubo un error', 'Hubo un erro al registrar la marcacion', 'error');
		}
	};

	const [value, setValue] = useState(new Date());
	const [currentTime, setCurrentTime] = useState('');
	useEffect(() => {
		const intervalId = setInterval(() => {
			// Obtener la hora actual utilizando Day.js
			const formattedTime = dayjs().format('HH:mm:ss');
			setCurrentTime(formattedTime);
		}, 1000);

		return () => clearInterval(intervalId); // Limpiar el intervalo en componentWillUnmount
	}, []);
	const [esFeriado, setEsFeriado] = useState(false);
	const [esRegistro, setEsRegistro] = useState(false);

	useEffect(() => {
		console.log(data);
		if (data?.responseType === 'feriado') {
			setEsFeriado(true);
		}
		if (data?.responseType === 'registro') {
			setEsRegistro(true);
		}
	}, []);

	return (
		<Card sx={{ height: 500 }}>
			{esFeriado && (
				<Box
					sx={{
						// backgroundColor: '#8e8ca3',
						width: '100%',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
					}}
				>
					<Button
						variant="outlined"
						onClick={() => {
							reset(false);
						}}
					>
						Volver
					</Button>
					<Lottie loop animationData={feriadoAnimation} play style={{ width: 200, height: 200 }} />

					<Typography sx={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Feriado</Typography>
					<Typography sx={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
						feliz {data?.feriado?.nombre}
					</Typography>
					<Typography style={{ fontSize: 40, fontWeight: 'bold' }}>{data?.feriado?.fecha}</Typography>
				</Box>
			)}
			{esRegistro && (
				<Box
					sx={{
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Grid container>
						<Grid
							item
							xs={6}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Card>
								<Typography variant="h1" sx={{ backgroundColor: 'white', textAlign: 'center' }}>
									{currentTime}
								</Typography>

								<Button variant="contained" onClick={guardarMarcacion} sx={{ margin: '20px' }}>
									Marcar {data?.dataButton?.tipo || 'Default Title'}
								</Button>
							</Card>
						</Grid>
						<Grid
							item
							xs={6}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Card
								sx={{
									display: 'flex',
									flexDirection: 'column',
									width: '100%',
									justifyContent: 'space-between',
								}}
							>
								<Box sx={{ ...styles.container, padding: 2 }}>
									<Typography variant="h6" sx={styles.topText}>
										Inicio de Marcacion: {data?.dataButton?.inicioMarcacion}
									</Typography>
									{data?.dataButton?.hora && (
										<Typography variant="h6" sx={styles.centerText}>
											Hora {data?.dataButton?.hora}
										</Typography>
									)}

									<Typography variant="h6" sx={styles.bottomText}>
										Fin Tolerancia: {data?.dataButton?.finMarcacion}
									</Typography>
									<Box
										sx={{
											width: '100%',
											backgroundColor: '#93ccc6',
											height: '50%',
											justifyContent: 'center',
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<Typography sx={styles.text}>Marcacion</Typography>
									</Box>
									<Box
										sx={{
											width: '100%',
											backgroundColor: '#fbc5d8',
											height: '50%',
											justifyContent: 'center',
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<Typography sx={styles.text}>Tolerancia</Typography>
									</Box>
								</Box>
							</Card>
						</Grid>
					</Grid>
				</Box>
			)}
			{data?.responseType == null && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						width: '100%',
						height: '100%',
						background: 'primary',
					}}
				>
					<Button
						variant="outlined"
						onClick={() => {
							reset(false);
						}}
					>
						Volver
					</Button>
					<Lottie loop animationData={registroAnimation} play style={{ width: 200, height: 200 }} />

					<Typography sx={{ fontSize: '30px' }} variant="h1">
						No quedan Mas Registros hoy
					</Typography>
				</Box>
			)}
		</Card>
	);
}

export default FichaTurno;
