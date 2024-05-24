import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	Checkbox,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
	Typography,
	Zoom,
} from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import Modal from '@/components/modal';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers';
import PageHeader from '@/components/pageHeader';
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

const ZoomTransition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function Turno() {
	const [modalNuevoTurno, setModalNuevoTurno] = useState(false);

	const [diaLaboral, setDiaLaboral] = useState('Lunes-Viernes');
	const handleDiaLaboral = (event) => {
		setDiaLaboral(event.target.value);
	};
	const handleOpenModalNuevoTurno = () => setModalNuevoTurno(true);
	const handleCloseModalNuevoTurno = () => setModalNuevoTurno(false);
	const [componente, setComponente] = useState(null);

	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};
	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		};
	}

	const [value, setValue] = useState(null);
	useEffect(() => {
		switch (diaLaboral) {
			case 'Lunes-Viernes':
				setComponente(<div>Lunes - Viernes</div>);
				break;
			case 'Lunes-Viernes+Sabado':
				setComponente(<div>Lunes - Viernes + Sábado</div>);
				break;
			case 'Lunes-Domingo':
				setComponente(<div>Todos los Días</div>);
				break;
			case 'Personalizado':
				setComponente(
					<Grid container fullWidth>
						<Grid item md="6">
							<Typography variant="body2" color="primary">
								Horario
							</Typography>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DemoContainer components={['TimePicker']}>
									<TimePicker label="Hora - Inicio" />
									<TimePicker label="Hora - Fin" />
								</DemoContainer>
							</LocalizationProvider>
						</Grid>
						<Grid item md="6">
							<Typography variant="body2" color="primary">
								Descanzo
							</Typography>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DemoContainer components={['TimePicker']}>
									<TimePicker label="Inicio - Descanso" />
									<TimePicker label="Fin- Descanso" />
								</DemoContainer>
							</LocalizationProvider>
						</Grid>
						,
					</Grid>,
				);
				break;
			default:
				setComponente(null);
				break;
		}
	}, [diaLaboral]);

	function createData(name, calories, fat, carbs, protein) {
		return { name, calories, fat, carbs, protein };
	}
	const daysOfWeek = [
		{ name: 'Lunes', number: 1 },
		{ name: 'Martes', number: 2 },
		{ name: 'Miércoles', number: 3 },
		{ name: 'Jueves', number: 4 },
		{ name: 'Viernes', number: 5 },
		{ name: 'Sábado', number: 6 },
		{ name: 'Domingo', number: 7 },
	];

	const [horarioLaboral, setHorarioLaboral] = useState([]);
	useEffect(() => {
		const newHorarioLaboral = daysOfWeek.map((day) => ({
			numero: day.number,
			nombre: day.name,
			id: day.number,
			horaInicioLaboral: dayjs('2022-04-17T08:00'),
			horaFinLaboral: dayjs('2022-04-17T17:30'),
			horaInicioDescanso: dayjs('2022-04-17T12:00'),
			horaFinDescanso: dayjs('2022-04-17T13:00'),
			totalHoraDia: 0,
			diaLaboral: false,
		}));

		setHorarioLaboral((prevHorarioLaboral) => [...prevHorarioLaboral, ...newHorarioLaboral]);
	}, []);

	const calcularTotalHoraDia = ({
		id,
		horaInicioLaboral,
		horaFinLaboral,
		horaInicioDescanso,
		horaFinDescanso,
		diaLaboral,
	}) => {
		const start = dayjs(horaInicioLaboral);
		const end = dayjs(horaFinLaboral);
		const startBreak = dayjs(horaInicioDescanso);
		const endBreak = dayjs(horaFinDescanso);

		const totalHours = end.diff(start, 'hour', true) - endBreak.diff(startBreak, 'hour', true);
		const totalMinutes = end.diff(start, 'minute') - endBreak.diff(startBreak, 'minute');

		const totalHoursWithMinutes = `${Math.floor(totalHours)} horas :${totalMinutes % 60} min`;

		setHorarioLaboral((prevHorarioLaboral) =>
			prevHorarioLaboral.map((d) =>
				d.id === id ? { ...d, totalHoraDia: diaLaboral ? totalHoursWithMinutes : 0 } : d,
			),
		);
	};
	const procesarDiaLaboralSegunId = (id) => {
		const { horaInicioDescanso, diaLaboral, horaInicioLaboral, horaFinDescanso, horaFinLaboral } =
			horarioLaboral.find((dia) => dia.id === id);
		calcularTotalHoraDia({
			horaInicioDescanso,
			horaInicioLaboral,
			horaFinDescanso,
			horaFinLaboral,
			id,
			diaLaboral,
		});
	};

	const cambioDiaLaboral = (event, id) => {
		const { checked } = event.target;

		console.log(checked);
		setHorarioLaboral((prevHorarioLaboral) =>
			prevHorarioLaboral.map((dia) => (dia.id === id ? { ...dia, diaLaboral: checked } : dia)),
		);
	};

	const cambioHora = (time, id, tipo) => {
		setHorarioLaboral((prevHorarioLaboral) =>
			prevHorarioLaboral.map((dia) => (dia.id === id ? { ...dia, [tipo]: time } : dia)),
		);
		procesarDiaLaboralSegunId(id);
	};

	const label = { inputProps: { 'aria-label': 'checkboxDia' } };
	return (
		<>
			<PageHeader title="Turno">
				<Breadcrumbs
					aria-label="breadcrumb"
					sx={{
						textTransform: 'uppercase',
					}}
				>
					<Link underline="hover" href="#!">
						Turno
					</Link>
					<Typography color="text.tertiary">Turno</Typography>
				</Breadcrumbs>
			</PageHeader>
			<Container maxWidth="lg">
				<Modal
					TransitionComponent={ZoomTransition}
					openModal={modalNuevoTurno}
					maxWidth="fullScreen"
					fnCloseModal={handleCloseModalNuevoTurno}
					title="Crear Turno"
					padding
				>
					<Box>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
								<Tab label="Simple" {...a11yProps(0)} />
								<Tab label="Avanzado" {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={tabValue} index={0}>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Dia Laboral</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={diaLaboral}
									label="Dias Laborales"
									onChange={handleDiaLaboral}
								>
									<MenuItem value="Lunes-Viernes">Lunes - Viernes</MenuItem>
									<MenuItem value="Lunes-Viernes+Sabado">Lunes - Vineres + Sabado</MenuItem>
									<MenuItem value="Lunes-Domingo">Todos los Dias</MenuItem>
									<MenuItem value="Personalizado">Personalizado</MenuItem>
								</Select>
								{componente}
							</FormControl>
						</TabPanel>
						<TabPanel value={tabValue} index={1}>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell align="center">
												<CheckIcon />
											</TableCell>
											<TableCell align="center">Dia</TableCell>
											<TableCell align="center">Hora Inicio</TableCell>
											<TableCell align="center">Hora Inicio Descanso</TableCell>
											<TableCell align="center">Hora Descanso</TableCell>
											<TableCell align="center">Hora Fin</TableCell>
											<TableCell align="center">Horas Esperadas</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{horarioLaboral.map((dia, index) => (
											<TableRow
												key={index}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell align="center">
													<Checkbox
														{...label}
														value={dia.id}
														checked={dia.diaLaboral}
														onChange={(event) => cambioDiaLaboral(event, dia.id)}
													/>
												</TableCell>
												<TableCell component="th" scope="row">
													{dia.nombre}
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<DemoContainer components={['TimePicker']}>
															<TimePicker
																disabled={!dia.diaLaboral}
																value={dia.horaInicioLaboral}
																onChange={(event) =>
																	cambioHora(event, dia.id, 'horaInicioLaboral')
																}
															/>
														</DemoContainer>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<DemoContainer components={['TimePicker']}>
															<TimePicker
																disabled={!dia.diaLaboral}
																value={dia.horaInicioDescanso}
																onChange={(event) =>
																	cambioHora(event, dia.id, 'horaInicioDescanso')
																}
															/>
														</DemoContainer>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<DemoContainer components={['TimePicker']}>
															<TimePicker
																disabled={!dia.diaLaboral}
																value={dia.horaFinDescanso}
																onChange={(event) =>
																	cambioHora(event, dia.id, 'horaFinDescanso')
																}
															/>
														</DemoContainer>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<DemoContainer components={['TimePicker']}>
															<TimePicker
																disabled={!dia.diaLaboral}
																value={dia.horaFinLaboral}
																onChange={(event) =>
																	cambioHora(event, dia.id, 'horaFinLaboral')
																}
															/>
														</DemoContainer>
													</LocalizationProvider>
												</TableCell>

												<TableCell align="center">{dia.totalHoraDia}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</TabPanel>
					</Box>
				</Modal>
				<CardContent>
					<Button variant="contained" onClick={() => handleOpenModalNuevoTurno()}>
						Nuevo Turno
					</Button>
				</CardContent>
			</Container>
		</>
	);
}

export default Turno;
