import AddIcon from '@mui/icons-material/Add';
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
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';
import PageHeader from '@/components/pageHeader';
import { Link } from 'react-router-dom';

import CardHeader from '@/components/cardHeader';
import { AccountCircle, Send } from '@mui/icons-material';

const data = [
	{
		name: {
			firstName: 'John',
			lastName: 'Doe',
		},
		address: '261 Erdman Ford',
		city: 'East Daphne',
		state: 'Kentucky',
	},
	{
		name: {
			firstName: 'Jane',
			lastName: 'Doe',
		},
		address: '769 Dominic Grove',
		city: 'Columbus',
		state: 'Ohio',
	},
	{
		name: {
			firstName: 'Joe',
			lastName: 'Doe',
		},
		address: '566 Brakus Inlet',
		city: 'South Linda',
		state: 'West Virginia',
	},
	{
		name: {
			firstName: 'Kevin',
			lastName: 'Vandy',
		},
		address: '722 Emie Stream',
		city: 'Lincoln',
		state: 'Nebraska',
	},
	{
		name: {
			firstName: 'Joshua',
			lastName: 'Rolluffs',
		},
		address: '32188 Larkin Turnpike',
		city: 'Omaha',
		state: 'Nebraska',
	},
];
function Persona() {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'name.firstName', // access nested data with dot notation
				header: 'Nombre',
				size: 150,
			},
			{
				accessorKey: 'name.lastName',
				header: 'Apellido',
				size: 150,
			},
			{
				accessorKey: 'address', // normal accessorKey
				header: 'Numero de Documento',
				size: 200,
			},
			{
				accessorKey: 'city',
				header: 'Grupo',
				size: 150,
			},
			{
				accessorKey: '123',
				header: 'Estado Contrato',
				size: 150,
			},
			{
				accessorKey: '1s23',
				header: 'Usuario',
				size: 150,
			},
		],
		[],
	);

	const table = useMaterialReactTable({
		columns,
		data, // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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

			<Card component="section" type="section">
				<CardHeader title="Persona" subtitle="Registro de Personal">
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
