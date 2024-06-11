import { v4 as uuid } from 'uuid';
// Icons
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import WebOutlinedIcon from '@mui/icons-material/WebOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
/**
 * @example
 * {
 *	id: number,
 *	type: "group" | "item",
 *	title: string,
 *	Icon: NodeElement
 *	menuChildren?: {title: string, href: string}[]
 *  menuMinWidth?: number
 * }
 */

const NAV_LINKS_CONFIG = [
	{
		id: uuid(),
		type: 'group',
		title: 'Personas',
		Icon: AccountCircleIcon,
		menuChildren: [
			{
				title: 'Persona',
				href: '/home/persona',
			},
			{
				title: 'Contrato',
				href: '/home/contrato',
			},
		],
	},
	{
		id: uuid(),
		type: 'group',
		title: 'Turnos',
		Icon: AccountCircleIcon,
		menuChildren: [
			{
				title: 'Turnos',
				href: '/home/turno',
			},
			{
				title: 'Feriados',
				href: '/home/Feriado',
			},
		],
	},

	{
		id: uuid(),
		type: 'item',
		title: 'Marcacion',
		href: '/home/marcacion',
		Icon: BarChartOutlinedIcon,
	},

	{
		id: uuid(),
		type: 'group',
		title: 'Reportes',
		menuChildren: [
			{
				title: 'Asistencia',
				href: '/home/Asistencia',
			},

		],
		Icon: BarChartOutlinedIcon,
	},

];

export default NAV_LINKS_CONFIG;
