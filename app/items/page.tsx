import { Suspense } from "react";
import Loading from "./loading";
import ItemsList from "./itemsList";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function Items() {
    return (
        <>
            <Typography variant="h5" sx={{marginBottom: 5}}>Items</Typography>
            <Paper>
                <Toolbar>
                    <Link variant="button" color="inherit" href="/items/add" underline="none">
                    Add
                    </Link>
                </Toolbar>
                <Divider />
                <Suspense fallback={<Loading />}>
                    <ItemsList />
                </Suspense>
            </Paper>
        </>
    )
}