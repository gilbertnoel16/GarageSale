'use client'

import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Loading from "../items/loading"
import { Suspense, useState } from "react"
import ItemsList from "./itemsList"
import TextField from "@mui/material/TextField"
import SearchRounded from "@mui/icons-material/SearchRounded"
import InputAdornment from "@mui/material/InputAdornment"
import { useDebouncedCallback } from "use-debounce"

export default function Checkout() {
    const [filter, setFilter] = useState<string>();

    const handleSearch = useDebouncedCallback((query: string) => {
        setFilter(query);
    }, 500)

    return (
        <>
            <Typography variant="h5" sx={{ marginBottom: 5 }}>Checkout</Typography>
            <Paper sx={{ maxWidth: 'lg' }}>
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

                <Suspense fallback={<Loading />}>
                    <ItemsList filter={filter} />
                </Suspense>
            </Paper>
        </>)
}