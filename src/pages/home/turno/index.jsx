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
	IconButton,
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
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import EditIcon from '@mui/icons-material/Edit';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
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
import shiftService from '@/services/shiftService';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

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

	const [dataHorarioS, setDataHorarioS] = useState({
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
		if (minutes === 0) {
			return `${hours} hora${hours >= 2 ? 's' : ''} `;
		}
		return `${hours} hora${hours >= 2 ? 's' : ''} con ${minutes} minutos`;
	};
	const [horarioSimple, setHorarioSimple] = useState({
		inicioMarcacionEntrada: dayjs().hour(7).minute(0),
		horaEntrada: dayjs().hour(8).minute(0),
		finMarcacionEntrada: dayjs().hour(8).minute(30),
		tolerancia: true,
		horaSalida: dayjs().hour(17).minute(30),
		finMarcacionSalida: dayjs().hour(20).minute(30),
		minutosDescanso: 65,
		inicioMarcacionDescanso: dayjs().hour(12).minute(0),
		finMarcacionDescanso: dayjs().hour(15).minute(0),

		descansoHabilitado: true,
		inicioMarcacionEntradaS: dayjs().hour(7).minute(0),
		horaEntradaS: dayjs().hour(8).minute(0),
		finMarcacionEntradaS: dayjs().hour(8).minute(30),
		toleranciaS: true,
		horaSalidaS: dayjs().hour(15).minute(0),
		finMarcacionSalidaS: dayjs().hour(19).minute(0),
		minutosDescansoS: 65,
		inicioMarcacionDescansoS: dayjs().hour(12).minute(0),
		finMarcacionDescansoS: dayjs().hour(15).minute(0),
		descansoHabilitadoS: true,
	});

	const handleInputChangeHorarioSimple = (value, fieldName) => {
		setHorarioSimple((e) => ({ ...e, [fieldName]: value }));
	};

	const daysOfWeek = [
		{ name: 'Lunes', number: 1 },
		{ name: 'Martes', number: 2 },
		{ name: 'Miércoles', number: 3 },
		{ name: 'Jueves', number: 4 },
		{ name: 'Viernes', number: 5 },
		{ name: 'Sábado', number: 6 },
		{ name: 'Domingo', number: 7 },
	];

	const minutosDiferencia = (inicio, fin) => {
		const formato = 'HH:mm'; // Formato para extraer solo horas y minutos
		const horaInicio = dayjs(inicio, formato);
		const horaFin = dayjs(fin, formato);

		// Si la hora de fin es anterior a la hora de inicio,
		// se asume que es al día siguiente, así que se suma un día
		if (horaFin.isBefore(horaInicio)) {
			horaFin.add(1, 'day');
		}

		// Calcular la diferencia en minutos
		const diferencia = Math.abs(horaFin.diff(horaInicio, 'minute'));

		return diferencia;
	};
	const memoizedHorarioLaboral = useMemo(
		() =>
			daysOfWeek.map((day) => ({
				numero: day.number,
				number: day.number,
				nombre: day.name,
				id: day.number,
				inicioMarcacionEntrada: dayjs().hour(7).minute(0),
				finMarcacionEntrada: dayjs().hour(8).minute(30),
				horaEntrada: dayjs().hour(8).minute(0),

				inicioMarcacionDescanso: dayjs().hour(12).minute(0),
				minutosDescanso: 60,
				habilitarDescanso: true,
				finMarcacionDescanso: dayjs().hour(15).minute(0),
				inicioMarcacionSalida: dayjs().hour(17).minute(30),
				finMarcacionSalida: dayjs().hour(20).minute(30),
				horaSalida: dayjs().hour(17).minute(30),

				minutosJornada: 580,

				minutosJornadaNeto: 530,
				diaLaboral: day.number !== 7, // Domingo no es laboral
			})),
		[],
	);

	const [horarioLaboral, setHorarioLaboral] = useState(memoizedHorarioLaboral);

	useEffect(
		(e) => {
			console.log(horarioLaboral);
		},
		[horarioLaboral],
	);

	const handleChangeHorarioLaboral = useCallback((newValue, dayNumber, field) => {
		setHorarioLaboral((prevState) =>
			prevState.map((day) => {
				if (day.numero === dayNumber) {
					const updatedDay = { ...day, [field]: newValue };

					if (field === 'horaEntrada' || field === 'horaSalida' || field === 'minutosDescanso') {
						updatedDay.minutosTrabajo = minutosDiferencia(updatedDay.horaEntrada, updatedDay.horaSalida);

						updatedDay.minutosJornadaNeto = updatedDay.minutosTrabajo - updatedDay.minutosDescanso;
					}

					return updatedDay;
				}
				return day;
			}),
		);
	}, []);

	useEffect(
		(e) => {
			let minutosJornadaSemanal = 0;
			const diasNoLaborales = [];
			horarioLaboral.map((e) => {
				if (e.diaLaboral) {
					minutosJornadaSemanal += e.minutosJornadaNeto;
				} else {
					diasNoLaborales.push(e.nombre);
				}
				return 'asd';
			});

			setDataHorario((e) => ({ diasNoLaborales, minutosSemanales: minutosJornadaSemanal }));
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

	const [data, setData] = useState([]);
	const fetchData = async () => {
		const response = await shiftService.getShift();
		console.log(response);
		setData(response);
	};
	useEffect(() => {
		fetchData();
	}, []);
	const columns = useMemo(
		() => [
			{
				accessorKey: 'name', // access nested data with dot notation
				header: 'Nombre',
			},
			{
				accessorKey: 'totalMinutosJornadaNeto', // normal accessorKey
				header: 'Horas Semanales',
				accessorFn: (row) => formatHours(row.totalMinutosJornadaNeto),
			},
		],
		[],
	);

	const table = useMaterialReactTable({
		columns,
		data,
		enableRowNumbers: true,
		enableRowActions: true,

		renderDetailPanel: ({ row }) => (
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="center">Dia</TableCell>
							<TableCell align="center">Hora Inicio</TableCell>
							<TableCell align="center">Hora Fin</TableCell>
							<TableCell align="center">Descanso</TableCell>
							<TableCell align="center">Horas</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{row.original?.shiftDetails.map((e) => (
							<TableRow>
								<TableCell align="center">{daysOfWeek[Number(e.diaSemana) - 1].name}</TableCell>
								<TableCell align="center">{e.horaEntrada}</TableCell>
								<TableCell align="center">{e.horaSalida}</TableCell>
								<TableCell align="center">{e.minutosDescanso}</TableCell>
								<TableCell align="center">{formatHours(e.minutosJornadaNeto)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		),
		renderRowActions: ({ row, table }) => [
			<Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
				<IconButton
					color="primary"
					onClick={() =>
						window.open(`mailto:kevinvandy@mailinator.com?subject=Hello ${row.original.firstName}!`)
					}
				>
					<EditIcon />
				</IconButton>

				<IconButton
					color="error"
					onClick={() => {
						data.splice(row.index, 1);
					}}
				>
					<DesktopAccessDisabledIcon />
				</IconButton>
			</Box>,
		],
	});

	const submitTurno = async () => {
		if (tabValue === 0) {
			if (diaLaboral === 'Lunes-Viernes+Sabado') {
				console.log(nombreTurno);
				console.log(horarioSimple);

				const newsDetallesTurnos = Array.from({ length: 5 }, (_, index) => ({
					numero: index + 1,
					number: index + 1,
					inicioMarcacionEntrada: horarioSimple.inicioMarcacionEntrada,
					finMarcacionEntrada: horarioSimple.finMarcacionEntrada,
					horaEntrada: horarioSimple.horaEntrada,

					inicioMarcacionDescanso: horarioSimple.inicioMarcacionDescanso,
					minutosDescanso: horarioSimple.minutosDescanso,
					finMarcacionDescanso: horarioSimple.finMarcacionDescanso,
					habilitarDescanso: horarioSimple.descansoHabilitado,

					inicioMarcacionSalida: horarioSimple.finMarcacionSalida,
					finMarcacionSalida: horarioSimple.horaSalida,
					horaSalida: horarioSimple.horaSalida,

					minutosJornada: minutosDiferencia(horarioSimple.horaEntrada, horarioSimple.horaSalida),

					minutosJornadaNeto:
						minutosDiferencia(horarioSimple.horaEntrada, horarioSimple.horaSalida) -
						horarioSimple.minutosDescanso,
					diaLaboral: true,
				}));
				const newTurno = {
					name: nombreTurno,
					type: diaLaboral,
					detalleTurno: newsDetallesTurnos,
				};
				const response = await shiftService.createShift(newTurno);
				console.log(response);
			}
		} else {
			console.log('asda');
			const newTurno = {
				name: nombreTurno,
				type: 'avanzado',
				detalleTurno: horarioLaboral,
			};
			const response = await shiftService.createShift(newTurno);
			console.log(response);
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
					<CardContent>
						{modalNuevoTurno ? (
							<Box>
								<Card>
									<Box>
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
											<Button variant="contained" sx={{ mx: 2 }} onClick={submitTurno}>
												Guardar
											</Button>

											<Button
												variant="contained"
												sx={{ mx: 2 }}
												color="error"
												onClick={handleCloseModalNuevoTurno}
											>
												Cancelar
											</Button>
										</Box>

										<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
											<Tabs
												value={tabValue}
												onChange={handleTabChange}
												aria-label="basic tabs example"
											>
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
													size="small"
													sx={{ mb: 2 }}
													onChange={handleDiaLaboral}
												>
													<MenuItem value="Lunes-Viernes+Sabado">
														Lunes - Viernes + Sabado
													</MenuItem>
													<MenuItem value="Lunes-Viernes">Lunes - Viernes</MenuItem>
													<MenuItem value="Lunes-Domingo">Todos los Dias</MenuItem>
													<MenuItem value="Personalizado">Personalizado</MenuItem>
												</Select>

												{diaLaboral === 'Personalizado' && (
													<Card sx={{ display: 'flex', justifyContent: 'center' }}>
														<FormGroup sx={{ display: 'flex' }} row>
															{daysOfWeek.map((e) => (
																<FormControlLabel
																	control={
																		<Checkbox
																			defaultChecked
																			onChange={() => {
																				setDiaLaboral(e.name);
																			}}
																		/>
																	}
																	label={e.name}
																/>
															))}
														</FormGroup>
													</Card>
												)}
												<Card>
													Horas Esperadas
													<Typography variant="h4">
														{formatHours(dataHorarioS.minutosSemanales)}
													</Typography>
												</Card>
												<Card>
													<CardHeader title="horario" />

													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<Grid container spacing={2}>
															<Grid item xs={8}>
																<Card>
																	<Typography variant="h4" sx={{ pb: 2 }}>
																		Entrada
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
																			slotProps={{
																				textField: { size: 'small' },
																			}}
																			value={horarioSimple.inicioMarcacionEntrada}
																			onChange={(event) =>
																				handleInputChangeHorarioSimple(
																					event,
																					'inicioMarcacionEntrada',
																				)
																			}
																		/>

																		<TimePicker
																			label="Hora Entrada"
																			slotProps={{
																				textField: { size: 'small' },
																			}}
																			value={horarioSimple.horaEntrada}
																			onChange={(event) =>
																				handleInputChangeHorarioSimple(
																					event,
																					'horaEntrada',
																				)
																			}
																		/>

																		<TimePicker
																			label="Fin Marcacion"
																			slotProps={{
																				textField: { size: 'small' },
																			}}
																			value={horarioSimple.finMarcacionEntrada}
																			onChange={(event) =>
																				handleInputChangeHorarioSimple(
																					event,
																					'finMarcacionEntrada',
																				)
																			}
																		/>

																		<FormGroup>
																			<FormControlLabel
																				control={
																					<Checkbox
																						checked={
																							horarioSimple.tolerancia
																						}
																						onChange={(event) =>
																							handleInputChangeHorarioSimple(
																								event.target.checked,
																								'tolerancia',
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
																			value={horarioSimple.horaSalida}
																			onChange={(event) =>
																				handleInputChangeHorarioSimple(
																					event,
																					'horaSalida',
																				)
																			}
																			slotProps={{
																				textField: { size: 'small' },
																			}}
																		/>

																		<TimePicker
																			label="Fin Marcacion"
																			value={horarioSimple.finMarcacionSalida}
																			onChange={(event) =>
																				handleInputChangeHorarioSimple(
																					event,
																					'finMarcacionSalida',
																				)
																			}
																			slotProps={{
																				textField: { size: 'small' },
																			}}
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
																						horarioSimple.descansoHabilitado
																					}
																					onChange={(event) =>
																						handleInputChangeHorarioSimple(
																							event.target.checked,
																							'descansoHabilitado',
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
																			disabled={!horarioSimple.descansoHabilitado}
																			value={horarioSimple.minutosDescanso}
																			onChange={(event) => {
																				handleInputChangeHorarioSimple(
																					event.target.value,
																					'minutosDescanso',
																				);
																			}}
																		/>

																		<TimePicker
																			label="Inicio Marcacion"
																			value={
																				horarioSimple.inicioMarcacionDescanso
																			}
																			disabled={!horarioSimple.descansoHabilitado}
																			onChange={(event) =>
																				handleInputChangeHorarioSimple(
																					event,
																					'inicioMarcacionDescanso',
																				)
																			}
																			slotProps={{
																				textField: { size: 'small' },
																			}}
																		/>
																		<TimePicker
																			label="Fin Marcacion"
																			value={horarioSimple.finMarcacionDescanso}
																			disabled={!horarioSimple.descansoHabilitado}
																			onChange={(event) =>
																				handleInputChangeHorarioSimple(
																					event,
																					'finMarcacionDescanso',
																				)
																			}
																			slotProps={{
																				textField: { size: 'small' },
																			}}
																		/>
																	</Box>
																</Card>
															</Grid>
														</Grid>
													</LocalizationProvider>
												</Card>

												{diaLaboral === 'Lunes-Viernes+Sabado' && (
													<Card>
														<CardHeader title="Sabado" />

														<LocalizationProvider dateAdapter={AdapterDayjs}>
															<Grid container spacing={2}>
																<Grid item xs={8}>
																	<Card>
																		<Typography variant="h4" sx={{ pb: 2 }}>
																			Entrada
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
																				slotProps={{
																					textField: { size: 'small' },
																				}}
																				value={
																					horarioSimple.inicioMarcacionEntradaS
																				}
																				onChange={(event) =>
																					handleInputChangeHorarioSimple(
																						event,
																						'inicioMarcacionEntradaS',
																					)
																				}
																			/>

																			<TimePicker
																				label="Hora Entrada"
																				slotProps={{
																					textField: { size: 'small' },
																				}}
																				value={horarioSimple.horaEntradaS}
																				onChange={(event) =>
																					handleInputChangeHorarioSimple(
																						event,
																						'horaEntradaS',
																					)
																				}
																			/>

																			<TimePicker
																				label="Fin Marcacion"
																				slotProps={{
																					textField: { size: 'small' },
																				}}
																				value={
																					horarioSimple.finMarcacionEntradaS
																				}
																				onChange={(event) =>
																					handleInputChangeHorarioSimple(
																						event,
																						'finMarcacionEntradaS',
																					)
																				}
																			/>

																			<FormGroup>
																				<FormControlLabel
																					control={
																						<Checkbox
																							checked={
																								horarioSimple.toleranciaS
																							}
																							onChange={(event) =>
																								handleInputChangeHorarioSimple(
																									event.target
																										.checked,
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
																				value={horarioSimple.horaSalidaS}
																				onChange={(event) =>
																					handleInputChangeHorarioSimple(
																						event,
																						'horaSalidaS',
																					)
																				}
																				slotProps={{
																					textField: { size: 'small' },
																				}}
																			/>

																			<TimePicker
																				label="Fin Marcacion"
																				value={
																					horarioSimple.finMarcacionSalidaS
																				}
																				onChange={(event) =>
																					handleInputChangeHorarioSimple(
																						event,
																						'finMarcacionSalidaS',
																					)
																				}
																				slotProps={{
																					textField: { size: 'small' },
																				}}
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
																							horarioSimple.descansoHabilitadoS
																						}
																						onChange={(event) =>
																							handleInputChangeHorarioSimple(
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
																					!horarioSimple.descansoHabilitadoS
																				}
																				value={horarioSimple.minutosDescansoS}
																				onChange={(event) => {
																					handleInputChangeHorarioSimple(
																						event.target.value,
																						'minutosDescansoS',
																					);
																				}}
																			/>

																			<TimePicker
																				label="Fin Marcacion"
																				value={
																					horarioSimple.inicioMarcacionDescansoS
																				}
																				disabled={
																					!horarioSimple.descansoHabilitadoS
																				}
																				onChange={(event) =>
																					handleInputChangeHorarioSimple(
																						event,
																						'inicioMarcacionDescansoS',
																					)
																				}
																				slotProps={{
																					textField: { size: 'small' },
																				}}
																			/>
																			<TimePicker
																				label="Fin Marcacion"
																				disabled={
																					!horarioSimple.descansoHabilitadoS
																				}
																				value={
																					horarioSimple.finMarcacionDescansoS
																				}
																				onChange={(event) =>
																					handleInputChangeHorarioSimple(
																						event,
																						'finMarcacionDescansoS',
																					)
																				}
																				slotProps={{
																					textField: { size: 'small' },
																				}}
																			/>
																		</Box>
																	</Card>
																</Grid>
															</Grid>
														</LocalizationProvider>
													</Card>
												)}
											</FormControl>
										</TabPanel>
										<TabPanel value={tabValue} index={1}>
											<Card>
												<CardContent>
													<Box>
														<Typography variant="h6">
															Horas Semana{setDataHorario}
														</Typography>
														<Typography variant="h4">
															{formatHours(dataHorario.minutosSemanales)}
														</Typography>
													</Box>
													<Box>
														<Typography variant="h6">Dia No Laboral</Typography>
														<Typography variant="h4">
															{' '}
															{dataHorario.diasNoLaborales.join(', ')}
														</Typography>
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
															<TableCell colSpan={4} align="center">
																.
															</TableCell>
															<TableCell align="center" colSpan={3}>
																Entrada
															</TableCell>
															<TableCell align="center" colSpan={3}>
																Descanso
															</TableCell>

															<TableCell align="center" colSpan={3}>
																Salida
															</TableCell>
														</TableRow>
														<TableRow>
															<TableCell align="center">
																<CheckIcon />
															</TableCell>
															<TableCell>Dia </TableCell>
															<TableCell>Trabajo</TableCell>
															<TableCell>Descanso</TableCell>

															<TableCell align="center">Rango Inicial</TableCell>
															<TableCell align="center">Hora</TableCell>
															<TableCell align="center">Rango Final</TableCell>

															<TableCell align="center">Rango Inicial</TableCell>
															<TableCell align="center">Minutos</TableCell>
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
																sx={{
																	'&:last-child td, &:last-child th': { border: 0 },
																}}
															>
																<TableCell align="left">
																	<Checkbox
																		onChange={(e) => {
																			cambioDiaLaboral(e, row.id);
																		}}
																		checked={row.diaLaboral}
																	/>
																</TableCell>
																<TableCell component="th" scope="row">
																	{row.nombre}
																</TableCell>
																<TableCell component="th" scope="row">
																	{formatHours(row.minutosJornadaNeto)}
																</TableCell>

																<TableCell component="th" scope="row">
																	{formatHours(row.minutosDescanso)}
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.inicioMarcacionEntrada}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'inicioMarcacionEntrada',
																				);
																			}}
																			disabled={!row.diaLaboral}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.horaEntrada}
																			disabled={!row.diaLaboral}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'horaEntrada',
																				);
																			}}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.finMarcacionEntrada}
																			disabled={!row.diaLaboral}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'finMarcacionEntrada',
																				);
																			}}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			disabled={!row.diaLaboral}
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.inicioMarcacionDescanso}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'inicioMarcacionDescanso',
																				);
																			}}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TextField
																			value={row.minutosDescanso}
																			size="small"
																			inputProps={{
																				min: 0,
																				style: { textAlign: 'center' },
																			}}
																			disabled={!row.diaLaboral}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e.target.value,
																					row.number,
																					'minutosDescanso',
																				);
																			}}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.finMarcacionDescanso}
																			disabled={!row.diaLaboral}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'finRangoMarcacionFinDescanso',
																				);
																			}}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.inicioMarcacionSalida}
																			disabled={!row.diaLaboral}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'inicioMarcacionSalida',
																				);
																			}}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.horaSalida}
																			disabled={!row.diaLaboral}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'horaSalida',
																				);
																			}}
																		/>
																	</LocalizationProvider>
																</TableCell>
																<TableCell align="center">
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			disabled={!row.diaLaboral}
																			slotProps={{ textField: { size: 'small' } }}
																			value={row.finMarcacionSalida}
																			onChange={(e) => {
																				handleChangeHorarioLaboral(
																					e,
																					row.number,
																					'finMarcacionSalida',
																				);
																			}}
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
							</Box>
						) : (
							<Box>
								<CardHeader title="Turno" subtitle="Registro de Turno">
									<Button variant="contained" onClick={() => handleOpenModalNuevoTurno()}>
										Generar Turno
									</Button>
								</CardHeader>
								<MaterialReactTable table={table} />
							</Box>
						)}
					</CardContent>
				</Card>
			</Box>
		</>
	);
}

export default Turno;
