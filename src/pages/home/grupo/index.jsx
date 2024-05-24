import CardHeader from '@/components/cardHeader';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/pageHeader';
import { Box, Breadcrumbs, Button, Card, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Modal from '@/components/modal';
import { useEffect, useMemo, useState } from 'react';
import clusterService from '@/services/clusterService';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { AccountCircle, Send } from '@mui/icons-material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Grupo() {
	const [isModalAddGroup, setModalAddGroup] = useState(false);

	const openModalAddGroup = () => {
		setModalAddGroup(true);
	};
	const closeModalAddGroup = () => {
		setModalAddGroup(false);
	};
	const [newCluster, setNewCluster] = useState();

	const [clusters, setClusters] = useState([]);
	const fetchClusters = async () => {
		try {
			const data = await clusterService.getClusters();
			setClusters(data);
		} catch (error) {
			console.error('Error fetching clusters:', error);
		}
	};

	const handleDeleteCluster = async (id) => {
		try {
			await clusterService.deleteCluster(id);
			setClusters(clusters.filter((cluster) => cluster.id !== id));
		} catch (error) {
			console.error(`Error deleting cluster with id ${id}:`, error);
		}
	};

	const setClusterUpdate = () => {};
	const handleCreateCluster = async () => {
		try {
			const createdCluster = await clusterService.createCluster(newCluster);
			setClusters([...clusters, createdCluster]);
			setNewCluster({ descripcion: '', fechaInicio: '', fechaFin: '' });
		} catch (error) {
			console.error('Error creating cluster:', error);
		}
	};

	const columns = useMemo(() => [
		{
			accessorKey: 'clusterName', // access nested data with dot notation
			header: 'Grupo',
		},
	]);

	useEffect(() => {
		fetchClusters();
	}, []);
	const table = useMaterialReactTable({
		columns,
		data: clusters,
		enableRowActions: true,

		renderRowActionMenuItems: ({ closeMenu }) => [
			<MenuItem
				key={0}
				onClick={() => {
					closeMenu();
				}}
				sx={{ m: 0 }}
			>
				<ListItemIcon>
					<DeleteIcon />
				</ListItemIcon>
				Eliminar
			</MenuItem>,
			<MenuItem
				key={1}
				onClick={() => {
					closeMenu();
				}}
				sx={{ m: 0 }}
			>
				<ListItemIcon>
					<UpgradeIcon />
				</ListItemIcon>
				Actualizar
			</MenuItem>,
		],
	});

	return (
		<>
			<Modal openModal={isModalAddGroup} fnCloseModal={closeModalAddGroup} title="Crear Nuevo Grupo" padding>
				<Box height="50vh">Content</Box>
			</Modal>
			<PageHeader title="Grupos">
				<Breadcrumbs
					aria-label="breadcrumb"
					sx={{
						textTransform: 'uppercase',
					}}
				>
					<Link underline="hover" href="#!">
						Grupos
					</Link>
					<Typography color="text.tertiary">Grupos</Typography>
				</Breadcrumbs>
			</PageHeader>

			<Card component="section" type="section">
				<CardHeader title="Grupo" subtitle="Registro de Grupos">
					<Button onClick={openModalAddGroup} variant="contained" disableElevation endIcon={<AddIcon />}>
						Nuevo
					</Button>
				</CardHeader>
				<MaterialReactTable table={table} />
			</Card>
		</>
	);
}
