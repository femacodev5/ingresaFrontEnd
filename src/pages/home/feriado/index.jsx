import PageHeader from '@/components/pageHeader';
import { Box, Breadcrumbs, Button, Card, Divider, IconButton, Stack, TextField, Typography, Zoom } from '@mui/material';
import { Link } from 'react-router-dom';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import CardHeader from '@/components/cardHeader';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import holidayService from '@/services/holidayService';
import { Controller, useForm } from 'react-hook-form';
import Modal from '@/components/modal';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import swal from 'sweetalert';

const ZoomTransition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

function feriado() {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'nombre',
				header: 'Nombre del feriado',
			},
			{
				accessorKey: 'fecha',
				header: 'Fecha',
			},
		],
		[],
	);

	const [data, setData] = useState([]);

	const fetchData = async () => {
		const response = await holidayService.getHolidays();

		setData(response);
	};
	const [openModalEditPersona, setOpenModalEditPersona] = useState(false);

	const {
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			date: dayjs(),
			name: '',
			holidayId: null,
		},
	});
	useEffect(() => {
		fetchData();
	}, []);
	const updateRowData = (row) => {
		console.log('asdas');

		setValue('feriadoId', row.feriadoId);
		setValue('date', dayjs(row.fecha));
		setValue('name', row.nombre);
		setOpenModalEditPersona(true);
	};

	const deleteRowData = async (row) => {
		const response = await holidayService.deleteHoliday(row.feriadoId);
		fetchData();
	};
	const table = useMaterialReactTable({
		columns,
		data,
		enableRowActions: true,
		renderRowActions: ({ row, table }) => (
			<Box>
				<IconButton color="primary" onClick={() => updateRowData(row.original)}>
					<EditIcon />
				</IconButton>

				<IconButton color="error" onClick={() => deleteRowData(row.original)}>
					<DeleteIcon />
				</IconButton>
			</Box>
		),
	});

	const onSubmitPerson = async (formData) => {
		if (!formData.feriadoId) {
			const response = await holidayService.createHoliday({
				nombre: formData.name,
				fecha: formData.date.format('YYYY-MM-DD'),
			});
		} else {
			const response = await holidayService.updateHoliday(formData.feriadoId, {
				...formData,
				nombre: formData.name,
				fecha: formData.date.format('YYYY-MM-DD'),
			});
		}
		fetchData();
		reset();
		setOpenModalEditPersona(false);
		swal('Genial', 'Se Registro Tu nuevo Dia de Descanso', 'success');
	};

	const feriadoNuevo = () => {
		setOpenModalEditPersona(true);
	};
	return (
		<>
			<Modal
				component="form"
				maxWidth="sm"
				TransitionComponent={ZoomTransition}
				openModal={openModalEditPersona}
				onSubmit={handleSubmit(onSubmitPerson)}
				fnCloseModal={() => setOpenModalEditPersona(false)}
				title="Editar Persona"
				padding
				sx={{
					'& .MuiTextField-root': { my: 2 },
				}}
			>
				<Controller
					name="name"
					control={control}
					defaultValue=""
					render={({ field }) => <TextField size="small" {...field} label="Nombre" fullWidth />}
				/>

				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Controller
						name="date"
						control={control}
						defaultValue={null}
						fullWidth
						render={({ field }) => (
							<DatePicker
								{...field}
								label="Selecciona una fecha"
								slotProps={{
									textField: { size: 'small', fullWidth: true },
								}}
								renderInput={(params) => <TextField fullWidth {...params} size="small" />}
							/>
						)}
					/>
				</LocalizationProvider>
				<Divider sx={{ m: 2 }} />
				<Stack direction="row" spacing={3} justifyContent="flex-end">
					<Button variant="contained" type="submit" endIcon={<SaveIcon />}>
						Guardar
					</Button>
				</Stack>
			</Modal>
			<PageHeader title="feriado">
				<Breadcrumbs
					aria-label="breadcrumb"
					sx={{
						textTransform: 'uppercase',
					}}
				>
					<Link underline="hover" href="#!">
						Turno
					</Link>
					<Typography color="text.tertiary">feriado</Typography>
				</Breadcrumbs>
			</PageHeader>
			<Card component="section" type="section">
				<CardHeader title="feriado" subtitle="Registro de feriados ">
					<Button
						variant="contained"
						disableElevation
						endIcon={<AddIcon />}
						onClick={() => {
							feriadoNuevo();
						}}
					>
						Nuevo
					</Button>
				</CardHeader>
				<MaterialReactTable table={table} />
			</Card>
		</>
	);
}
export default feriado;
