import { Breadcrumbs, Card, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import PageHeader from '@/components/pageHeader';
import { Link } from 'react-router-dom';

import CardHeader from '@/components/cardHeader';

import personService from '@/services/personService';

function Persona() {
	const [data, setData] = useState([]);
	useEffect(async () => {
		const response = await personService.getPersons();
		console.log(response);
		setData(response);
	}, []);

	useEffect(() => {
		console.log(data);
	}, [data]);

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
				accessorKey: 'documentNumber', // normal accessorKey
				header: 'Numero de Documento',
			},
			{
				accessorKey: 'email',
				header: 'Correo',
			},
			{
				accessorKey: 'clusterName',
				header: 'Grupo',
			},
			{
				accessorKey: 'estadoContrato',
				header: 'Estado Contrato',
			},
		],
		[],
	);

	const table = useMaterialReactTable({
		columns,
		data,
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
