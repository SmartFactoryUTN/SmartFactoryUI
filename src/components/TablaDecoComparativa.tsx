import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  nombre: string,
  tiempoAprendizaje: string,
  costo: string,
  especializado: string,
  comunidad: string,
  actualizaciones: string,
) {
  return { nombre, tiempoAprendizaje, costo, especializado, comunidad, actualizaciones };
}

const rows = [
  createData('Inkscape', '✅', '✅', '❌', '✅', '✅'),
  createData('Seamly2D', '❌', '✅', '✅', '✅', '✅'),
  createData('Valentina', '❌', '✅', '✅', '⚠️', '⚠️'),
  createData('Gerber AccuMark', '❌', '❌', '✅', '❌', '✅'),
  createData('Lectra Modaris', '❌', '❌', '✅', '❌', '✅'),
];

export default function TablaComparativaSoftware() {
  return (
    <TableContainer sx={{ mt: 1, mb:2 }} component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="tabla comparativa de software">
        <TableHead>
          <TableRow>
            <TableCell>Software</TableCell>
            <TableCell align="center">Gratuita</TableCell>
            <TableCell align="center">Especializada en confección de moldes</TableCell>
            <TableCell align="center">Comunidad activa</TableCell>
            <TableCell align="center">Actualizaciones frecuentes</TableCell>
            <TableCell align="center">Tiempo de aprendizaje</TableCell>
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
              <TableCell align="center">{row.tiempoAprendizaje}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}