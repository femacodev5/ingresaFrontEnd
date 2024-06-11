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
	Stack,
	Typography,
} from '@mui/material';

import './Reloj.css';

import { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

import BackspaceIcon from '@mui/icons-material/Backspace';
import DoneIcon from '@mui/icons-material/Done';
import { useTheme } from '@mui/material/styles';
import personService from '@/services/personService';
import Camera from '@/components/camara';
import FichaTurno from '@/components/fichaTurno';

function Marcacion() {
	const theme = useTheme();
	const [value, setValue] = useState(new Date());

	const [dni, setDni] = useState('74976849');
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

	const [openFichaTurno, setOpenFichaTurno] = useState(false);
	const [openCamara, setOpenCamara] = useState(false);

	const [dataPerson, setDataPerson] = useState();
	const [employeeImageUris, setEmployeeImageUris] = useState([]);

	const [esFeriado, setEsFeriado] = useState(false);

	const handleDonePress = async () => {
		const response = await personService.comprobarDni({ dni });

		setDataPerson(response);

		setOpenFichaTurno(true);

		// setOpenCamara(true);
	};
	for (let i = 0; i < 10; i += 1) {
		buttonList.push(
			<Button
				key={i}
				sx={{ width: '100%' }}
				value={i}
				size="large"
				fullWidth
				onClick={(e) => {
					addNumberDni(e);
				}}
			>
				{i}
			</Button>,
		);
	}
	useEffect(() => {
		const interval = setInterval(() => setValue(new Date()), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	const date = new Date();

	const [dataTime, setDataTime] = useState({
		horas: date.getHours(),
		minutos: date.getMinutes(),
		segundos: date.getSeconds(),
	});

	useEffect(() => {
		const timer = setInterval(() => {
			const date = new Date();
			setDataTime({
				horas: date.getHours(),
				minutos: date.getMinutes(),
				segundos: date.getSeconds(),
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<Box sx={{ padding: 3 }}>
			{openFichaTurno ? (
				<FichaTurno data={dataPerson} reset={setOpenFichaTurno} />
			) : (
				<Card sx={{ padding: 3, backgroundColor: theme.palette.background.default }}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Box
								sx={{
									width: '100%',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center',
									padding: 2,
									borderRadius: 2,
								}}
							>
								<div className="contador">
									<p>
										{dataTime.horas < 10 ? ` 0${dataTime.horas}` : dataTime.horas} h :{' '}
										{dataTime.minutos < 10 ? ` 0${dataTime.minutos}` : dataTime.minutos} min :{' '}
										{dataTime.segundos < 10 ? ` 0${dataTime.segundos}` : dataTime.segundos} seg
									</p>
								</div>

								<Clock value={value} />
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Stack spacing={3} sx={{ alignItems: 'center' }}>
								<Input
									inputProps={{
										min: 0,
										style: {
											textAlign: 'center',
											fontSize: theme.typography.h4.fontSize,
											color: theme.palette.primary.main,
											padding: '10px',
										},
									}}
									fullWidth
									size="lg"
									placeholder="DNI"
									value={dni}
									onChange={(event) => setDni(event.target.value)}
									sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}
								/>
								<Grid container spacing={2} justifyContent="center">
									{buttonList.map((button, index) => (
										<Grid item xs={4} key={index}>
											{button}
										</Grid>
									))}
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Button
											onClick={deleteNumberDni}
											fullWidth
											color="error"
											variant="contained"
											startIcon={<BackspaceIcon />}
										>
											Borrar
										</Button>
									</Grid>
									<Grid item xs={6}>
										<Button
											onClick={handleDonePress}
											fullWidth
											color="success"
											variant="contained"
											startIcon={<DoneIcon />}
										>
											Listo
										</Button>
									</Grid>
								</Grid>
							</Stack>
						</Grid>
					</Grid>
				</Card>
			)}
		</Box>
	);
}
export default Marcacion;
