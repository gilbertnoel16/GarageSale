'use client'

import { Suspense } from "react";
import Loading from "./loading";
import ItemsList from "./itemsList";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Add from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

export default function Items() {
    return (
        <>
            <Typography variant="h5" sx={{ marginBottom: 5 }}>Items</Typography>
            <Paper sx={{ maxWidth: 'lg' }}>
                <Toolbar>
                    <Link variant="button" href="/items/add" color="inherit">
                        <IconButton aria-label="delete" color="inherit">
                            <Add />
                        </IconButton>
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