import prisma from "@/db";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default async function ItemsList() {
    const items = await prisma.item.findMany({
        include: {
            donator: true
        }
    });

    return (<TableContainer component={Paper}>
        <Table aria-label="Items">
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Donator</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map((item) => (
                    <TableRow
                        key={item.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {item.id}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.donator?.name ?? '-'}</TableCell>
                        <TableCell>{item.price.toLocaleString()}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)
}