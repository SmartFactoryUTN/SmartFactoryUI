import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  nombre: string,
  costo: string,
  especializado: string,
  comunidad: string,
  actualizaciones: string,
) {
  return { nombre, costo, especializado, comunidad, actualizaciones };
}

const rows = [
  createData('Seamly2D', '✅', '✅', '✅', '✅'),
  createData('Valentina', '✅', '✅', '⚠️', '⚠️'),
  createData('Inkscape', '✅', '❌', '✅', '✅'),
  createData('Gerber AccuMark', '❌', '✅', '❌', '✅'),
  createData('Lectra Modaris', '❌', '✅', '❌', '✅'),
];

export default function TablaComparativaSoftware() {
  return (
    <TableContainer sx={{ mt: 3 }} component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="tabla comparativa de software">
        <TableHead>
          <TableRow>
            <TableCell>Software</TableCell>
            <TableCell align="center">Costo</TableCell>
            <TableCell align="center">Especializado en patrones</TableCell>
            <TableCell align="center">Comunidad activa</TableCell>
            <TableCell align="center">Actualizaciones frecuentes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.nombre}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.nombre}
              </TableCell>
              <TableCell align="center">{row.costo}</TableCell>
              <TableCell align="center">{row.especializado}</TableCell>
              <TableCell align="center">{row.comunidad}</TableCell>
              <TableCell align="center">{row.actualizaciones}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}