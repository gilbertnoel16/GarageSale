'use client'

import { Suspense, useState } from "react";
import Loading from "./loading";
import ItemsList from "./itemsList";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchRounded from "@mui/icons-material/SearchRounded";
import Add from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useDebouncedCallback } from "use-debounce";

export default function Items() {
    const [filter, setFilter] = useState<string>();

    const handleSearch = useDebouncedCallback((query: string) => {
        setFilter(query);
    }, 500)

    return (
        <>
            <Typography variant="h5" sx={{ marginBottom: 5 }}>Items</Typography>
            <Paper sx={{ maxWidth: 'lg' }}>
                <Toolbar>
                    <TextField
                        id="search"
                        label="Search"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRounded />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        onChange={(e => handleSearch(e.target.value))}
                    />

                    <Link variant="button" color="inherit" href="/items/add" underline="none">
                        <IconButton aria-label="delete" disabled color="primary">
                            <Add />
                        </IconButton>
                    </Link>
                </Toolbar>

                <Divider />

                <Suspense fallback={<Loading />}>
                    <ItemsList filter={filter} />
                </Suspense>
            </Paper>
        </>
    )
}