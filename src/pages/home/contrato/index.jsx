import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

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
	TextField,
	Tooltip,
	Typography,
	Zoom,
} from '@mui/material';
// eslint-disable-next-line camelcase
import { MRT_EditActionButtons, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState, forwardRef } from 'react';
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

const ZoomTransition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

function CardContractsByPersons({ id }) {
	const { handleSubmit, control, reset, setValue } = useForm({
		defaultValues: { contractId: null, id: null },
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
				accessorKey: 'state',
				header: 'state',
			},
		],
		[],
	);
	const [isCreateAndUpdateContractModal, setIsCreateAndUpdateContractModal] = useState(false);
	const openCreateContractModal = () => {
		setIsCreateAndUpdateContractModal(true);
	};
	const updateContract = async (data) => {
		try {
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
				<Tooltip title="Finalizar Contrato">
					<IconButton color="error" onClick={() => console.log(row)}>
						<EventBusyIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
	});

	const closeCreateContractModal = () => {
		setIsCreateAndUpdateContractModal(false);
	};

	const createNewContract = async (data) => {
		await contractService.createContract({
			...data,
			startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
			endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
			personid: id,
		});
	};
	const updateNewContract = async (dataForm) => {
		await contractService.updateContract(dataForm.contractId, {
			...dataForm,
			startDate: dayjs(dataForm.startDate).format('YYYY-MM-DD'),
			endDate: dayjs(dataForm.endDate).format('YYYY-MM-DD'),
			personid: id,
		});
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
	return (
		<Card>
			<Modal
				openModal={isCreateAndUpdateContractModal}
				fnCloseModal={closeCreateContractModal}
				title="Generar Contrato"
				sx={{
					'& .MuiTextField-root': { p: 1 },
				}}
			>
				<Box component="form" height="50vh" sx={{ py: 2 }} onSubmit={handleSubmit(onSubmit)}>
					<LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Controller
								name="startDate"
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										label="Inicio de Contrato"
										renderInput={(params) => <TextField {...params} fullWidth />}
									/>
								)}
							/>
							<Controller
								name="endDate"
								fullWidth
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										label="Fin de Contrato"
										renderInput={(params) => <TextField {...params} fullWidth />}
									/>
								)}
							/>
						</Box>
					</LocalizationProvider>
					<Controller
						name="salary"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								id="outlined-basic-1"
								fullWidth
								label="Sueldo"
								variant="outlined"
								type="number"
							/>
						)}
					/>
					<Controller
						name="vacation"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								id="outlined-basic-2"
								fullWidth
								label="Dias de Vacaciones"
								variant="outlined"
								type="number"
							/>
						)}
					/>
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Button variant="contained" type="submit" endIcon={<SaveIcon />}>
							Guardar
						</Button>
					</Box>
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

	const openDeleteConfirmModal = (row) => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			console.log(row);
		}
	};

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
					<IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
						<EventBusyIcon />
					</IconButton>
				</Tooltip>
			</Box>
		),
	});

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
				TransitionComponent={ZoomTransition}
				openModal={modalNuevoTurno}
				maxWidth="fullScreen"
				fnCloseModal={handleCloseModalNuevoTurno}
				title="Crear Turno"
				padding
			>
				asdasd
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
