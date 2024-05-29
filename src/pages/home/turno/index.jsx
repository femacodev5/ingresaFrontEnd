import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	FormGroup,
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
	TextField,
	Typography,
	Zoom,
} from '@mui/material';

import { forwardRef, useCallback, useEffect, useState } from 'react';
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
import CardHeader from '@/components/cardHeader';

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
	const [dataHorario, setDataHorario] = useState({
		diasNoLaborales: [],
		minutosSemanales: 1,
	});

	const [dataHorarioLVS, setDataHorarioLVS] = useState({
		diasNoLaborales: [],
		minutosSemanales: 1,
	});

	const [diaLaboral, setDiaLaboral] = useState('Lunes-Viernes+Sabado');
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

	const formatHours = (minutos) => {
		const totalMinutes = Math.round(minutos); // Redondear la diferencia total de minutos
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours} horas con ${minutes} minutos`;
	};
	const [horarioLunesAViernesSabado, setHorarioLunesAViernesSabado] = useState({
		inicioMarcacionIngresoLV: dayjs().hour(7).minute(0),
		horaIngresoLV: dayjs().hour(8).minute(0),
		finMarcacionIngresoLV: dayjs().hour(8).minute(30),
		toleranciaLV: true,
		horaSalidaLV: dayjs().hour(17).minute(30),
		finMarcacionSalidaLV: dayjs().hour(20).minute(30),
		minutosDescansoLV: 65,
		inicioMarcacionDescansoLV: dayjs().hour(12).minute(0),
		finMarcacionDescansoLV: dayjs().hour(15).minute(0),

		descansoHabilitadoLV: true,
		inicioMarcacionIngresoS: dayjs().hour(7).minute(0),
		horaIngresoS: dayjs().hour(8).minute(0),
		finMarcacionIngresoS: dayjs().hour(8).minute(30),
		toleranciaS: true,
		horaSalidaS: dayjs().hour(15).minute(0),
		finMarcacionSalidaS: dayjs().hour(19).minute(0),
		minutosDescansoS: 65,
		inicioMarcacionDescansoS: dayjs().hour(12).minute(0),
		finMarcacionDescansoS: dayjs().hour(15).minute(0),
		descansoHabilitadoS: true,
	});

	const handleInputChangeHorarioLunesAViernesSabado = (value, fieldName) => {
		setHorarioLunesAViernesSabado((e) => ({ ...e, [fieldName]: value }));
	};

	function calcularMinutosLVS() {
		const {
			horaSalidaLV,
			horaIngresoLV,
			horaIngresoS,
			horaSalidaS,
			minutosDescansoLV,
			minutosDescansoS,
			descansoHabilitadoLV,
			descansoHabilitadoS,
		} = horarioLunesAViernesSabado;

		const totalMinutosLV = +horaSalidaLV.diff(horaIngresoLV, 'minute') * 5;
		const totalMinutosS = +horaSalidaS.diff(horaIngresoS, 'minute');

		const totalMinutosSemanaSinDescanso =
			totalMinutosLV +
			totalMinutosS -
			(descansoHabilitadoS ? minutosDescansoS : 0) -
			(descansoHabilitadoLV ? minutosDescansoLV : 0) * 5;

		console.log(formatHours(totalMinutosSemanaSinDescanso));

		setDataHorarioLVS((e) => ({
			...e,
			minutosSemanales: totalMinutosSemanaSinDescanso,
		}));
	}
	useEffect(() => {
		calcularMinutosLVS();
	}, [horarioLunesAViernesSabado]);

	const daysOfWeek = [
		{ name: 'Lunes', number: 1 },
		{ name: 'Martes', number: 2 },
		{ name: 'Miércoles', number: 3 },
		{ name: 'Jueves', number: 4 },
		{ name: 'Viernes', number: 5 },
		{ name: 'Sábado', number: 6 },
		{ name: 'Domingo', number: 7 },
	];

	const [horarioLaboral, setHorarioLaboral] = useState(
		daysOfWeek.map((day) => ({
			numero: day.number,
			nombre: day.name,
			id: day.number,

			inicioRangoMarcacionIngreso: dayjs().hour(7).minute(0),
			finRangoMarcacionIngreso: dayjs().hour(8).minute(30),
			horaIngreso: dayjs().hour(8).minute(0),

			inicioRangoMarcacionInicioDescanso: dayjs().hour(12).minute(0),
			finRangoMarcacionInicioDescanso: dayjs().hour(15).minute(0),
			horaInicioDescanso: dayjs().hour(13).minute(0),

			inicioRangoMarcacionFinDescanso: dayjs().hour(12).minute(0),
			finRangoMarcacionFinDescanso: dayjs().hour(16).minute(0),
			horaFinDescanso: dayjs().hour(14).minute(0),

			inicioRangoMarcacionSalida: dayjs().hour(17).minute(30),
			finRangoMarcacionSalida: dayjs().hour(20).minute(30),
			horaSalida: dayjs().hour(17).minute(30),

			minutosTrabajo: 0,
			minutosDescanso: 0,
			diaLaboral: day.number !== 7, // Domingo no es laboral
		})),
	);

	useEffect(
		(e) => {
			console.log('canbio');
		},
		[horarioLaboral],
	);
	const cambioDiaLaboral = (event, id) => {
		const { checked } = event.target;

		console.log(checked);
		setHorarioLaboral((prevHorarioLaboral) =>
			prevHorarioLaboral.map((dia) => (dia.id === id ? { ...dia, diaLaboral: checked } : dia)),
		);
	};

	const actualizarHorarioLaboral = () => {
		let minutosSemanales = 0;
		const diasNoLaborales = [];
		const updatedHorarioLaboral = horarioLaboral?.map((dia) => {
			const ingreso = dia.marcaciones.find((marc) => marc.tipo === 'ingreso');
			const salida = dia.marcaciones.find((marc) => marc.tipo === 'salida');
			const inicioDescanso = dia.marcaciones.find((marc) => marc.tipo === 'inicioDescanso');
			const finDescanso = dia.marcaciones.find((marc) => marc.tipo === 'finDescanso');

			if (dia.diaLaboral) {
				if (ingreso && salida && inicioDescanso && finDescanso) {
					const minutosTrabajo = salida.hora.diff(ingreso.hora, 'minute');
					const minutosDescanso = finDescanso.hora.diff(inicioDescanso.hora, 'minute');

					const diffInMinutes = minutosTrabajo - minutosDescanso;

					minutosSemanales += diffInMinutes; // Convertir de minutos a horas

					setDataHorario((prevState) => ({
						...prevState,
						minutosSemanales, // Convertir minutos a horas
					}));
					// Solo actualizar si las horas han cambiado
					if (dia.totalHoraDia !== diffInMinutes || dia.inicioDescanso !== minutosDescanso) {
						return {
							...dia,
							minutosTrabajo,
							minutosDescanso,
						};
					}
				}
			} else {
				diasNoLaborales.push(dia.nombre);
				setDataHorario((prevState) => ({
					...prevState,
					diasNoLaborales,
				}));
			}
			return dia;
		});

		const hasChanged = JSON.stringify(horarioLaboral) !== JSON.stringify(updatedHorarioLaboral);
		if (hasChanged) {
			setHorarioLaboral(updatedHorarioLaboral);
		}
	};

	const cambioHora = (value, diaId, tipo, campo) => {
		setHorarioLaboral((prevState) =>
			prevState.map((dia) =>
				dia.id === diaId
					? {
							...dia,
							marcaciones: dia.marcaciones.map((marcacion) =>
								marcacion.tipo === tipo ? { ...marcacion, [campo]: value } : marcacion,
							),
					  }
					: dia,
			),
		);
	};

	const label = { inputProps: { 'aria-label': 'checkboxDia' } };

	const [nombreTurno, setNombreTurno] = useState('');
	const submitTurno = () => {
		if (diaLaboral === 'Lunes-Viernes+Sabado') {
			console.log(nombreTurno);
			console.log(horarioLunesAViernesSabado);

			const newsDetallesTurnos = Array.from({ length: 5 }, () => ({
				inicioMarcacionEntrada: horarioLunesAViernesSabado.inicioMarcacionIngresoLV,
				horaEntrada: horarioLunesAViernesSabado.horaIngresoLV,
				finMarcacionEntrada: horarioLunesAViernesSabado.finMarcacionIngresoLV,
				inicioToleranciaEntrada: horarioLunesAViernesSabado.toleranciaLV
					? horarioLunesAViernesSabado.horaIngresoLV
					: null,
				finToleranciaEntrada: horarioLunesAViernesSabado.toleranciaLV
					? horarioLunesAViernesSabado.finMarcacionIngresoLV
					: null,
			}));
			console.log(newsDetallesTurnos);
			const newTurno = {
				nombre: nombreTurno,
				tipo: diaLaboral,
				detalleTurno: [],
			};
		}
	};
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
			<Box>
				<Card>
					<Box>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
								<Tab label="Simple" {...a11yProps(0)} />
								<Tab label="Avanzado" {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={tabValue} index={0}>
							<Box sx={{ display: 'flex', my: 2 }}>
								<TextField
									size="small"
									fullWidth
									label="Nombre del turno"
									value={nombreTurno}
									onChange={(e) => {
										setNombreTurno(e.target.value);
									}}
								/>
								<Button variant="contained" sx={{ mx: 2 }} size="small" onClick={submitTurno}>
									Guardar
								</Button>
							</Box>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Dia Laboral</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={diaLaboral}
									label="Dias Laborales"
									size="small"
									sx={{ mb: 2 }}
									onChange={handleDiaLaboral}
								>
									<MenuItem value="Lunes-Viernes+Sabado">Lunes - Viernes + Sabado</MenuItem>
									<MenuItem value="Lunes-Viernes">Lunes - Viernes</MenuItem>
									<MenuItem value="Lunes-Domingo">Todos los Dias</MenuItem>
									<MenuItem value="Personalizado">Personalizado</MenuItem>
								</Select>
								{diaLaboral === 'Lunes-Viernes+Sabado' && (
									<Box>
										<Card>
											<CardHeader title="Lunes -Viernes " />

											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<Grid container spacing={2}>
													<Grid item xs={8}>
														<Card>
															<Typography variant="h4" sx={{ pb: 2 }}>
																Ingreso
															</Typography>
															<Box
																sx={{
																	display: 'flex',
																	justifyContent: 'start',
																	alignItems: 'center',
																	width: '100%',

																	'.MuiTextField-root': {
																		minWidth: '0px',

																		width: '150px',
																		mr: 2,
																	},
																}}
															>
																<TimePicker
																	label="Inicio Marcacion"
																	slotProps={{ textField: { size: 'small' } }}
																	value={
																		horarioLunesAViernesSabado.inicioMarcacionIngresoLV
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'inicioMarcacionIngresoLV',
																		)
																	}
																/>

																<TimePicker
																	label="Hora Ingreso"
																	slotProps={{ textField: { size: 'small' } }}
																	value={horarioLunesAViernesSabado.horaIngresoLV}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'horaIngresoLV',
																		)
																	}
																/>

																<TimePicker
																	label="Fin Marcacion"
																	slotProps={{ textField: { size: 'small' } }}
																	value={
																		horarioLunesAViernesSabado.finMarcacionIngresoLV
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'finMarcacionIngresoLV',
																		)
																	}
																/>

																<FormGroup>
																	<FormControlLabel
																		control={
																			<Checkbox
																				checked={
																					horarioLunesAViernesSabado.toleranciaLV
																				}
																				onChange={(event) =>
																					handleInputChangeHorarioLunesAViernesSabado(
																						event.target.checked,
																						'toleranciaLV',
																					)
																				}
																			/>
																		}
																		label=" tiempo de Tolerancia"
																	/>
																</FormGroup>
															</Box>
														</Card>
													</Grid>
													<Grid item xs={4}>
														<Card>
															<Typography variant="h4" sx={{ pb: 2 }}>
																Salida
															</Typography>
															<Box
																sx={{
																	display: 'flex',
																	justifyContent: 'start',
																	alignItems: 'center',
																	width: '100%',

																	'.MuiTextField-root': {
																		minWidth: '0px',

																		width: '150px',
																		mr: 2,
																	},
																}}
															>
																<TimePicker
																	label="Hora Salida"
																	value={horarioLunesAViernesSabado.horaSalidaLV}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'horaSalidaLV',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>

																<TimePicker
																	label="Fin Marcacion"
																	value={
																		horarioLunesAViernesSabado.finMarcacionSalidaLV
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'finMarcacionSalidaLV',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>
															</Box>
														</Card>
													</Grid>
													<Grid item xs={12}>
														<Card>
															<Box
																sx={{
																	display: 'flex',

																	alignItems: 'center',
																	justifyContent: 'space-between',
																}}
															>
																<Typography variant="h4" sx={{ pb: 2 }}>
																	Descanso
																</Typography>
																<FormControlLabel
																	control={
																		<Checkbox
																			checked={
																				horarioLunesAViernesSabado.descansoHabilitadoLV
																			}
																			onChange={(event) =>
																				handleInputChangeHorarioLunesAViernesSabado(
																					event.target.checked,
																					'descansoHabilitadoLV',
																				)
																			}
																		/>
																	}
																	label="Habilitar descanso"
																/>
															</Box>

															<Box
																sx={{
																	display: 'flex',
																	justifyContent: 'start',
																	alignItems: 'center',
																	width: '100%',

																	'.MuiTextField-root': {
																		minWidth: '0px',

																		width: '150px',
																		mr: 2,
																	},
																}}
															>
																<TextField
																	size="small"
																	label="minutos Descanso"
																	type="number"
																	disabled={
																		!horarioLunesAViernesSabado.descansoHabilitadoLV
																	}
																	value={horarioLunesAViernesSabado.minutosDescansoLV}
																	onChange={(event) => {
																		handleInputChangeHorarioLunesAViernesSabado(
																			event.target.value,
																			'minutosDescansoLV',
																		);
																	}}
																/>

																<TimePicker
																	label="Inicio Marcacion"
																	value={
																		horarioLunesAViernesSabado.inicioMarcacionDescansoLV
																	}
																	disabled={
																		!horarioLunesAViernesSabado.descansoHabilitadoLV
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'inicioMarcacionDescansoLV',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>
																<TimePicker
																	label="Fin Marcacion"
																	value={
																		horarioLunesAViernesSabado.finMarcacionDescansoLV
																	}
																	disabled={
																		!horarioLunesAViernesSabado.descansoHabilitadoLV
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'finMarcacionDescansoLV',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>
															</Box>
														</Card>
													</Grid>
												</Grid>
											</LocalizationProvider>
										</Card>
										<Card>
											<CardHeader title="Sabado" />

											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<Grid container spacing={2}>
													<Grid item xs={8}>
														<Card>
															<Typography variant="h4" sx={{ pb: 2 }}>
																Ingreso
															</Typography>
															<Box
																sx={{
																	display: 'flex',
																	justifyContent: 'start',
																	alignItems: 'center',
																	width: '100%',

																	'.MuiTextField-root': {
																		minWidth: '0px',

																		width: '150px',
																		mr: 2,
																	},
																}}
															>
																<TimePicker
																	label="Inicio Marcacion"
																	slotProps={{ textField: { size: 'small' } }}
																	value={
																		horarioLunesAViernesSabado.inicioMarcacionIngresoS
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'inicioMarcacionIngresoS',
																		)
																	}
																/>

																<TimePicker
																	label="Hora Ingreso"
																	slotProps={{ textField: { size: 'small' } }}
																	value={horarioLunesAViernesSabado.horaIngresoS}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'horaIngresoS',
																		)
																	}
																/>

																<TimePicker
																	label="Fin Marcacion"
																	slotProps={{ textField: { size: 'small' } }}
																	value={
																		horarioLunesAViernesSabado.finMarcacionIngresoS
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'finMarcacionIngresoS',
																		)
																	}
																/>

																<FormGroup>
																	<FormControlLabel
																		control={
																			<Checkbox
																				checked={
																					horarioLunesAViernesSabado.toleranciaS
																				}
																				onChange={(event) =>
																					handleInputChangeHorarioLunesAViernesSabado(
																						event.target.checked,
																						'toleranciaS',
																					)
																				}
																			/>
																		}
																		label=" tiempo de Tolerancia"
																	/>
																</FormGroup>
															</Box>
														</Card>
													</Grid>
													<Grid item xs={4}>
														<Card>
															<Typography variant="h4" sx={{ pb: 2 }}>
																Salida
															</Typography>
															<Box
																sx={{
																	display: 'flex',
																	justifyContent: 'start',
																	alignItems: 'center',
																	width: '100%',

																	'.MuiTextField-root': {
																		minWidth: '0px',

																		width: '150px',
																		mr: 2,
																	},
																}}
															>
																<TimePicker
																	label="Hora Salida"
																	value={horarioLunesAViernesSabado.horaSalidaS}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'horaSalidaS',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>

																<TimePicker
																	label="Fin Marcacion"
																	value={
																		horarioLunesAViernesSabado.finMarcacionSalidaS
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'finMarcacionSalidaS',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>
															</Box>
														</Card>
													</Grid>
													<Grid item xs={12}>
														<Card>
															<Box
																sx={{
																	display: 'flex',

																	alignItems: 'center',
																	justifyContent: 'space-between',
																}}
															>
																<Typography variant="h4" sx={{ pb: 2 }}>
																	Descanso
																</Typography>
																<FormControlLabel
																	control={
																		<Checkbox
																			checked={
																				horarioLunesAViernesSabado.descansoHabilitadoS
																			}
																			onChange={(event) =>
																				handleInputChangeHorarioLunesAViernesSabado(
																					event.target.checked,
																					'descansoHabilitadoS',
																				)
																			}
																		/>
																	}
																	label="Habilitar descanso"
																/>
															</Box>
															<Box
																sx={{
																	display: 'flex',
																	justifyContent: 'start',
																	alignItems: 'center',
																	width: '100%',

																	'.MuiTextField-root': {
																		minWidth: '0px',

																		width: '150px',
																		mr: 2,
																	},
																}}
															>
																<TextField
																	size="small"
																	label="minutos Almuero"
																	type="number"
																	disabled={
																		!horarioLunesAViernesSabado.descansoHabilitadoS
																	}
																	value={horarioLunesAViernesSabado.minutosDescansoS}
																	onChange={(event) => {
																		handleInputChangeHorarioLunesAViernesSabado(
																			event.target.value,
																			'minutosDescansoS',
																		);
																	}}
																/>

																<TimePicker
																	label="Fin Marcacion"
																	value={
																		horarioLunesAViernesSabado.inicioMarcacionDescansoS
																	}
																	disabled={
																		!horarioLunesAViernesSabado.descansoHabilitadoS
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'inicioMarcacionDescansoS',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>
																<TimePicker
																	label="Fin Marcacion"
																	disabled={
																		!horarioLunesAViernesSabado.descansoHabilitadoS
																	}
																	value={
																		horarioLunesAViernesSabado.finMarcacionDescansoS
																	}
																	onChange={(event) =>
																		handleInputChangeHorarioLunesAViernesSabado(
																			event,
																			'finMarcacionDescansoS',
																		)
																	}
																	slotProps={{ textField: { size: 'small' } }}
																/>
															</Box>
														</Card>
													</Grid>
												</Grid>
											</LocalizationProvider>
										</Card>
									</Box>
								)}

								<Card>
									Horas Esperadas:
									<Typography variant="h4">{formatHours(dataHorarioLVS.minutosSemanales)}</Typography>
								</Card>
							</FormControl>
						</TabPanel>
						<TabPanel value={tabValue} index={1}>
							<Card>
								<CardContent>
									<Box>
										<Typography variant="h6">Horas Semana</Typography>
										<Typography variant="h4">
											{formatHours(dataHorario.minutosSemanales)}
										</Typography>
									</Box>
									<Box>
										<Typography variant="h6">Dia No Laboral</Typography>
										<Typography variant="h4"> {dataHorario.diasNoLaborales.join(', ')}</Typography>
									</Box>
								</CardContent>
							</Card>
							<TableContainer component={Paper}>
								<Table
									sx={{
										'.MuiTextField-root': {
											minWidth: '0px',

											width: '120px',
											mr: 2,
										},
									}}
									aria-label="simple table"
								>
									<TableHead>
										<TableRow>
											<TableCell colSpan={2} align="center">
												Dia Semana
											</TableCell>
											<TableCell align="center" colSpan={3}>
												Ingreso
											</TableCell>
											<TableCell align="center" colSpan={3}>
												Inicio Descanso
											</TableCell>
											<TableCell align="center" colSpan={3}>
												Fin Descanso
											</TableCell>
											<TableCell align="center" colSpan={3}>
												Salida
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell align="center">
												<CheckIcon />
											</TableCell>
											<TableCell>Dia Semana</TableCell>

											<TableCell align="center">Rango Inicial</TableCell>
											<TableCell align="center">Hora</TableCell>
											<TableCell align="center">Rango Final</TableCell>

											<TableCell align="center">Rango Inicial</TableCell>
											<TableCell align="center">Hora</TableCell>
											<TableCell align="center">Rango Final</TableCell>

											<TableCell align="center">Rango Inicial</TableCell>
											<TableCell align="center">Hora</TableCell>
											<TableCell align="center">Rango Final</TableCell>

											<TableCell align="center">Rango Inicial</TableCell>
											<TableCell align="center">Hora</TableCell>
											<TableCell align="center">Rango Final</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{horarioLaboral?.map((row) => (
											<TableRow
												key={row.nombre}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell align="left">
													<Checkbox value={row.diaLaboral} />
												</TableCell>
												<TableCell component="th" scope="row">
													{row.nombre}
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.inicioRangoMarcacionIngreso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.horaIngreso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.finRangoMarcacionIngreso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.inicioRangoMarcacionInicioDescanso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.horaInicioDescanso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.finRangoMarcacionInicioDescanso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.inicioRangoMarcacionFinDescanso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.horaFinDescanso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.finRangoMarcacionFinDescanso}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.inicioRangoMarcacionSalida}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.horaSalida}
														/>
													</LocalizationProvider>
												</TableCell>
												<TableCell align="center">
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<TimePicker
															slotProps={{ textField: { size: 'small' } }}
															value={row.finRangoMarcacionSalida}
														/>
													</LocalizationProvider>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</TabPanel>
					</Box>
				</Card>
				<Modal
					TransitionComponent={ZoomTransition}
					openModal={modalNuevoTurno}
					maxWidth="fullScreen"
					fnCloseModal={handleCloseModalNuevoTurno}
					title="Crear Turno"
					padding
				>
					d
				</Modal>
				<CardContent>
					<Button variant="contained" onClick={() => handleOpenModalNuevoTurno()}>
						Nuevo Turno
					</Button>
				</CardContent>
			</Box>
		</>
	);
}

export default Turno;
