import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	Zoom,
} from '@mui/material';

import CameraAltIcon from '@mui/icons-material/CameraAlt';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/components/pageHeader';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

import CardHeader from '@/components/cardHeader';

import personService from '@/services/personService';
import Modal from '@/components/modal';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import SaveIcon from '@mui/icons-material/Save';
import shiftService from '@/services/shiftService';
import DetectorRostros from '@/components/detectorRostros.jsx';

const ZoomTransition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

function Persona() {
	const [data, setData] = useState([]);

	const fechData = async () => {
		const response = await personService.getPersons();
		console.log(response);
		setData(response);
	};

	const [shifts, setShifts] = useState([]);
	const fetchShiftSelect = async () => {
		const shifts = await shiftService.getShiftSelect();
		setShifts(shifts);
	};

	useEffect(() => {
		fechData();
		fetchShiftSelect();
	}, []);

	const {
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {},
	});

	const columns = useMemo(
		() => [
			{
				accessorKey: 'firstName', // access nested data with dot notation
				header: 'Nombre',
			},
			{
				accessorKey: 'lastName',
				header: 'Apellido',
			},
			{
				accessorKey: 'code', // normal accessorKey
				header: 'Numero de Documento',
			},
			{
				accessorKey: 'turnoNombre', // normal accessorKey
				header: 'Turno',
			},
			{
				accessorKey: 'jobTitle', // normal accessorKey
				header: 'Tipo',
			},
		],
		[],
	);

	const [openModalEditPerson, setOperonModalEditPerson] = useState(false);
	const [openModalCamaraPerson, setOpenModalCamaraPerson] = useState(false);
	const [person, setPerson] = useState({});

	const editPersona = async (rowData) => {
		setPerson(rowData);
		console.log(rowData);
		setValue('turnoId', rowData.turnoId);
		setValue('empID', rowData.empID);
		setOperonModalEditPerson(true);
	};

	const tomarFotoPersona = async (rowData) => {
		setPerson(rowData);

		setValue('turnoId', rowData.turnoId);
		setValue('empID', rowData.empID);
		setOpenModalCamaraPerson(true);
	};

	const onSubmitPerson = async (formData) => {
		const responseUpdatePerson = await personService.updatePerson(formData.empID, formData);

		reset();
		fechData();
		setOperonModalEditPerson(false);
	};
	const table = useMaterialReactTable({
		columns,
		data,
		enableRowActions: true,
		renderRowActions: ({ row }) => (
			<Box>
				<IconButton onClick={() => editPersona(row.original)}>
					<EditIcon />
				</IconButton>
				<IconButton onClick={() => tomarFotoPersona(row.original)}>
					<CameraAltIcon />
				</IconButton>
			</Box>
		),
	});

	return (
		<>
			<PageHeader title="Persona">
				<Breadcrumbs
					aria-label="breadcrumb"
					sx={{
						textTransform: 'uppercase',
					}}
				>
					<Link underline="hover" href="#!">
						Personas
					</Link>
					<Typography color="text.tertiary">Persona</Typography>
				</Breadcrumbs>
			</PageHeader>
			<Modal
				component="form"
				maxWidth="lg"
				TransitionComponent={ZoomTransition}
				openModal={openModalEditPerson}
				onSubmit={handleSubmit(onSubmitPerson)}
				fnCloseModal={() => setOperonModalEditPerson(false)}
				title="Editar Persona"
				padding
				sx={{
					'& .MuiTextField-root': { my: 2 },
				}}
			>
				<Typography variant="h4">Dni</Typography>
				<Typography variant="subtitle1">{person?.code}</Typography>
				<Typography variant="h4">Nombre</Typography>
				<Typography variant="subtitle1">
					{person?.firstName} {person?.lastName}
				</Typography>
				<Controller
					name="turnoId"
					control={control}
					render={({ field }) => (
						<FormControl fullWidth sx={{ mt: 2 }}>
							<InputLabel size="small" id="demo-simple-select-label">
								Turno
							</InputLabel>
							<Select
								{...field}
								labelId="demo-simple-select-label"
								size="small"
								id="demo-simple-select"
								label="Turno"
							>
								<MenuItem value="">Seleccionar</MenuItem>
								{shifts.map((e, index) => (
									<MenuItem key={index} value={e.turnoId}>
										{e?.nombre}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				/>

				<Divider sx={{ m: 2 }} />
				<Stack direction="row" spacing={3} justifyContent="flex-end">
					<Button variant="contained" type="submit" endIcon={<SaveIcon />}>
						Guardar
					</Button>
				</Stack>
			</Modal>
			<Modal padding openModal={openModalCamaraPerson} fnCloseModal={() => setOpenModalCamaraPerson(false)}>
				<DetectorRostros empID={person?.empID} />
			</Modal>

			<Card component="section" type="section">
				<CardHeader title="Persona" subtitle="Horario ">
					{/* <Button variant="contained" disableElevation endIcon={<AddIcon />}> */}
					{/* 	Nuevo */}
					{/* </Button> */}
				</CardHeader>
				<MaterialReactTable table={table} />
			</Card>
		</>
	);
}

export default Persona;
