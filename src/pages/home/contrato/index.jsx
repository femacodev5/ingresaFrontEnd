/* eslint-disable react/no-unstable-nested-components */
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
	Avatar,
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	Hidden,
	IconButton,
	Stack,
	TextField,
	Tooltip,
	Typography,
	Zoom,
} from '@mui/material';
// eslint-disable-next-line camelcase
import { MRT_EditActionButtons, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState, forwardRef, useRef } from 'react';
import PageHeader from '@/components/pageHeader';
import SaveIcon from '@mui/icons-material/Save';
import CardHeader from '@/components/cardHeader';

import Modal from '@/components/modal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useForm } from 'react-hook-form';
import personService from '@/services/personService';
import { deepOrange, deepPurple } from '@mui/material/colors';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import contractService from '@/services/contractService';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const ZoomTransition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

function CardContractsByPersons({ id }) {
	const {
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			contractId: null,
			id: null,
			startDate: dayjs(),
			endDate: dayjs(),
		},
	});

	const [data, setData] = useState([]);
	const [personData, setPersonData] = useState(null);
	const [validationErrors, setValidationErrors] = useState({});
	async function fetchData() {
		const response = await contractService.getContractsByIdPersons(id);
		setData(response);
	}

	async function fetchPersonData() {
		const response = await personService.getPersonById(id);

		setPersonData(response);
	}

	useEffect(() => {
		fetchData();
		fetchPersonData();
	}, []);
	const columnsContractsByIdPerson = useMemo(
		() => [
			{
				accessorKey: 'salary', // access nested data with dot notation
				header: 'Sueldo',
			},
			{
				accessorKey: 'vacation',
				header: 'Dias de Vacaciones',
				type: 'number',
			},
			{
				accessorKey: 'startDate', // normal accessorKey
				header: 'Inicio',
				type: 'datetime',
			},
			{
				accessorKey: 'endDate', // normal accessorKey
				header: 'Fin',
				type: 'datetime',
			},
			{
				accessorKey: 'contractId', // normal accessorKey
				header: 'contractId',
				type: 'number',
				enableHiding: true,
			},
			{
				accessorKey: 'contractFileUrl',
				header: 'contrato',
				Cell: ({ renderedCellValue, row }) => (
					<IconButton target="_blank" href={`${import.meta.env.VITE_BASE_URL}/uploads/${renderedCellValue}`}>
						<PictureAsPdfIcon />
					</IconButton>
				),
			},
		],
		[],
	);
	const [isCreateAndUpdateContractModal, setIsCreateAndUpdateContractModal] = useState(false);
	const openCreateContractModal = () => {
		setIsCreateAndUpdateContractModal(true);
	};

	const [isUpdating, setisUpdating] = useState(false);
	const updateContract = async (data) => {
		try {
			setisUpdating(true);
			openCreateContractModal();
			setValue('startDate', dayjs(data.startDate));
			setValue('endDate', dayjs(data.endDate));
			setValue('salary', data.salary);
			setValue('vacation', data.vacation);
			setValue('contractId', data.contractId);
			setValue('id', data.contractId);
			// setValue('diasVacaciones', data.vacation);
		} catch (error) {
			console.error('Error updating contract:', error);
		}
	};

	const tableContractsByPerson = useMaterialReactTable({
		columns: columnsContractsByIdPerson,
		data,
		enableEditing: true,
		createDisplayMode: 'modal',
		editDisplayMode: 'modal',
		getRowId: (row) => row.contractId,
		initialState: { columnVisibility: { contractId: false } },
		renderRowActions: ({ row, table, cell }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title="Visualizar Contratos">
					<IconButton onClick={() => updateContract(row.original)}>
						<EditIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
	});

	const closeCreateContractModal = () => {
		setIsCreateAndUpdateContractModal(false);
	};

	const createNewContract = async (data) => {
		setisUpdating(false);
		console.log(data);
		const formData = new FormData();
		formData.append('file', data.contrato[0]);

		formData.append('startDate', dayjs(data.startDate).format('YYYY-MM-DD'));
		formData.append('endDate', dayjs(data.endDate).format('YYYY-MM-DD'));
		formData.append('vacation', data.vacation);
		formData.append('salary', data.salary);
		formData.append('personid', id);

		await contractService.createContract(formData);
	};
	const updateNewContract = async (dataForm) => {
		console.log(data);

		const formData = new FormData();

		formData.append('file', dataForm?.contrato ? dataForm?.contrato[0] : null);
		formData.append('startDate', dayjs(dataForm.startDate).format('YYYY-MM-DD'));

		formData.append('contractId', dataForm.contractId);
		formData.append('endDate', dayjs(dataForm.endDate).format('YYYY-MM-DD'));
		formData.append('vacation', dataForm.vacation);
		formData.append('salary', dataForm.salary);
		formData.append('personid', id);

		await contractService.updateContract(dataForm.contractId, formData);
	};
	const onSubmit = async (data) => {
		if (data.contractId) {
			await updateNewContract(data);
		} else {
			await createNewContract(data);
		}
		fetchData();
		closeCreateContractModal();
		reset();
	};

	const fileInputRef = useRef(null);
	const handleButtonClick = () => {
		fileInputRef.current.click();
	};
	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (file) {
			console.log('Selected file:', file);
			// Aquí puedes manejar el archivo seleccionado, como cargarlo a un servidor o procesarlo
		}
	};

	return (
		<Card>
			<Modal
				openModal={isCreateAndUpdateContractModal}
				fnCloseModal={closeCreateContractModal}
				title="Generar Contrato"
				sx={{
					'& .MuiTextField-root': { my: 1 },
				}}
			>
				<Box component="form" sx={{ p: 1 }} onSubmit={handleSubmit(onSubmit)}>
					<LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Controller
								name="startDate"
								control={control}
								rules={{ required: 'Inicio de contrato es requerido' }}
								render={({ field }) => (
									<DatePicker
										{...field}
										label="Inicio de Contrato"
										renderInput={(params) => (
											<TextField
												{...params}
												fullWidth
												error={!!errors.startDate}
												helperText={errors.startDate?.message}
											/>
										)}
										slotProps={{
											textField: { size: 'small' },
										}}
									/>
								)}
							/>
							<Controller
								name="endDate"
								fullWidth
								rules={{ required: 'Fin de contrato es requerido' }}
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										renderInput={(params) => (
											<TextField
												{...params}
												fullWidth
												error={!!errors.endDate}
												helperText={errors.endDate?.message}
											/>
										)}
										label="Fin de Contrato"
										slotProps={{
											textField: { size: 'small' },
										}}
									/>
								)}
							/>
						</Box>
					</LocalizationProvider>
					<Controller
						name="salary"
						control={control}
						rules={{ required: 'Sueldo es requerido' }}
						render={({ field }) => (
							<TextField
								{...field}
								size="small"
								id="outlined-basic-1"
								fullWidth
								label="Sueldo"
								variant="outlined"
								type="number"
								error={!!errors.salary}
								helperText={errors.salary?.message}
							/>
						)}
					/>
					<Controller
						name="vacation"
						control={control}
						rules={{ required: 'Días de vacaciones son requeridos' }}
						render={({ field }) => (
							<TextField
								{...field}
								size="small"
								id="outlined-basic-2"
								fullWidth
								label="Días de Vacaciones"
								variant="outlined"
								type="number"
								error={!!errors.vacation}
								helperText={errors.vacation?.message}
							/>
						)}
					/>

					<Controller
						name="contrato"
						control={control}
						rules={{ required: isUpdating ? false : 'Contrato es requerido' }}
						render={({ field }) => (
							<>
								<Box sx={{ display: 'flex' }}>
									<Button variant="contained" fullWidth color="primary" onClick={handleButtonClick}>
										{field.value ? (
											<Typography variant="body1">{field.value[0]?.name}</Typography>
										) : (
											'Seleccionar Contrato'
										)}
									</Button>
								</Box>
								<input
									type="file"
									ref={fileInputRef}
									style={{ display: 'none' }}
									onChange={(e) => field.onChange(e.target.files)}
								/>{' '}
							</>
						)}
					/>
					{errors.contrato && <Typography color="error">{errors.contrato.message}</Typography>}
					<Divider sx={{ m: 2 }} />

					<Stack direction="row" spacing={3} justifyContent="flex-end">
						<Button variant="contained" type="submit" endIcon={<SaveIcon />}>
							Guardar
						</Button>
					</Stack>
				</Box>
			</Modal>

			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					Contratos de {personData?.firstName} {personData?.lastName} Identificación:
					{personData?.documentNumber}
				</Typography>
			</CardContent>
			<Box>
				<Grid container spacing={2}>
					<Grid item md={3} xs={12}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								width: '100%',
								pb: 2,
							}}
						>
							<Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: 3 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									<Avatar sx={{ bgcolor: deepOrange[500] }}>
										{personData?.firstName[0]}
										{personData?.lastName[0]}
									</Avatar>
								</Box>
								<CardContent>
									<Divider />
									<Typography variant="body2" sx={{ py: 2 }} color="text.secondary">
										<b>Identificación : </b> {personData?.documentNumber}
									</Typography>
									<Divider />
									<Typography variant="body2" sx={{ py: 2 }} color="text.secondary">
										<b>Persona :</b> {personData?.firstName}
										{personData?.lastName}
									</Typography>
									<Divider />
									<Typography variant="body2" sx={{ py: 2 }} color="text.secondary">
										<b>Turno :</b> Día no Laboral
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small">Ver Perfil</Button>
									<Button size="small">Contactar</Button>
								</CardActions>
							</Card>
						</Box>
					</Grid>
					<Grid item md={9}>
						<CardHeader
							title="Contratos actuales de usuarios
"
							subtitle="Registro de Contratos"
						>
							<Button
								variant="contained"
								size="small"
								disableElevation
								endIcon={<AddIcon />}
								onClick={openCreateContractModal}
							>
								Nuevo
							</Button>
						</CardHeader>

						<MaterialReactTable table={tableContractsByPerson} />
					</Grid>
				</Grid>
			</Box>
		</Card>
	);
}
function Contrato() {
	const [modalNuevoTurno, setModalNuevoTurno] = useState(false);
	const handleOpenModalNuevoTurno = () => setModalNuevoTurno(true);
	const handleCloseModalNuevoTurno = () => setModalNuevoTurno(false);

	const [data, setData] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const response = await personService.getPersonsContracts();
			setData(response);
		}

		fetchData();
	}, []);

	const {
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			personaId: null,
			id: null,
			fechaDin: dayjs(),
			archivo: null,
		},
	});

	const columns = useMemo(
		() => [
			{
				accessorKey: 'firstName', // access nested data with dot notation
				header: 'Nombre',
				enableHiding: true,
			},
			{
				accessorKey: 'lastName',
				header: 'Apellido',
			},
			{
				accessorKey: 'documentNumber', // normal accessorKey
				header: 'Dni',
			},
			{
				accessorKey: 'startDate', // normal accessorKey
				header: 'Inicio de Contrato',
			},
			{
				accessorKey: 'endDate', // normal accessorKey
				header: 'Fin de Contrato',
				columnVisibility: false,
				enableHiding: true,
			},
			{
				accessorKey: 'estadoContrato',
				header: 'Estado Contrato',
				enableHiding: true,
			},
			{
				accessorKey: 'personId',
				header: 'ID',
				traderName: false,
			},
		],
		[],
	);

	const [viewCardContractsByPersonId, setViewCardContractsByPersonId] = useState(null);
	const openCardContractsByPersonId = (id) => {
		setViewCardContractsByPersonId(id);
	};
	const [openModalFinalizarContratoPersona, setOpenModalFinalizarContratoPersona] = useState(false);

	const [nombreContrato, setNombreContrato] = useState('');
	const dataFinaLizarContrato = (data) => {
		setNombreContrato(data.fileName);

		setValue('personId', data.personId);
		setOpenModalFinalizarContratoPersona(true);
	};

	const table = useMaterialReactTable({
		columns,
		data,
		enableEditing: true,
		enableHiding: true,
		initialState: { columnVisibility: { personId: false } },
		getRowId: (row) => row.personId,
		renderRowActions: ({ row, table }) => (
			<Box sx={{ display: 'flex', gap: '1rem' }}>
				<Tooltip title="Visualizar Contratos">
					<IconButton onClick={() => openCardContractsByPersonId(row.id)}>
						<ManageSearchIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Finalizar Contrato">
					<IconButton
						disabled={row.original.estadoContrato !== 'Contrato Vigente'}
						color="error"
						onClick={() => dataFinaLizarContrato(row.original)}
					>
						<EventBusyIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
	});

	const fileInputFinContratoRef = useRef(null);
	const handleFileFinContrato = () => {
		fileInputFinContratoRef.current.click();
	};

	async function onSubmitFinalizarContrato(dataForm) {
		console.log(dataForm);

		const formData = new FormData();
		formData.append('file', dataForm.contrato[0]);
		formData.append('fechaFinContrato', dayjs(dataForm.endDate).format('YYYY-MM-DD'));
		formData.append('personId', dataForm.personId);
		await contractService.endContract(formData);
	}
	return (
		<>
			<PageHeader title="Contrato">
				<Breadcrumbs
					aria-label="breadcrumb"
					sx={{
						textTransform: 'uppercase',
					}}
				>
					<Typography color="text.tertiary">Contrato</Typography>
				</Breadcrumbs>
			</PageHeader>

			<Modal
				component="form"
				TransitionComponent={ZoomTransition}
				openModal={openModalFinalizarContratoPersona}
				fnCloseModal={() => setOpenModalFinalizarContratoPersona(false)}
				title="Finalizar Contrato"
				padding
				onSubmit={handleSubmit(onSubmitFinalizarContrato)}
				sx={{
					'& .MuiTextField-root': { my: 1 },
				}}
			>
				<Box>
					<Box sx={{ py: 2 }}>
						Nombre contrato
						<Typography variant="h4">{nombreContrato}</Typography>
					</Box>
					<LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Controller
								name="fechaFinContrato"
								fullWidth
								rules={{ required: 'Fin de contrato es requerido' }}
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										renderInput={(params) => (
											<TextField
												{...params}
												fullWidth
												error={!!errors.endDate}
												helperText={errors.endDate?.message}
											/>
										)}
										label="Fin de Contrato"
										slotProps={{
											textField: { size: 'small' },
										}}
									/>
								)}
							/>
						</Box>
					</LocalizationProvider>

					<Controller
						name="contrato"
						control={control}
						rules={{ required: 'Contrato es requerido' }}
						render={({ field }) => (
							<>
								<Box sx={{ display: 'flex' }}>
									<Button
										variant="contained"
										fullWidth
										color="primary"
										onClick={handleFileFinContrato}
									>
										{field.value ? (
											<Typography variant="body1">{field.value[0]?.name}</Typography>
										) : (
											'Seleccionar Contrato'
										)}
									</Button>
								</Box>
								<input
									type="file"
									ref={fileInputFinContratoRef}
									style={{ display: 'none' }}
									onChange={(e) => field.onChange(e.target.files)}
								/>{' '}
							</>
						)}
					/>
					<Divider sx={{ m: 2 }} />
					<Stack direction="row" spacing={3} justifyContent="flex-end">
						<Button
							size="small"
							color="error"
							variant="contained"
							onClick={() => setOpenModalFinalizarContratoPersona(false)}
						>
							Cerrar
						</Button>
						<Button size="small" variant="contained" type="submit" endIcon={<SaveIcon />}>
							Guardar
						</Button>
					</Stack>
				</Box>
			</Modal>

			{viewCardContractsByPersonId ? (
				<CardContractsByPersons id={viewCardContractsByPersonId} />
			) : (
				<Card component="section" type="section">
					<CardHeader
						title="Contratos actuales de usuarios
"
						subtitle="Registro de Contratos"
					/>

					<MaterialReactTable table={table} />
				</Card>
			)}
		</>
	);
}

export default Contrato;
