'use client'

import { getDonators } from "@/app/action";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Loading from "../loading";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

export default function AddItem() {
    const [donators, setDonators] = useState<string[]>([])

    useEffect(() => {
        (async () => {
            const donators = await getDonators()
            setDonators(donators.map(donator => donator.name))
        })()
    }, [])

    if (donators.length === 0) {
        return <Loading />
    }

    return (
        <Box component="form" display='flex' sx={{ flexDirection: 'column', gap: 4, justifyContent: 'space-between', maxWidth: 'md' }}>
            <TextField id="id" label="ID" variant="outlined" />
            <TextField id="description" label="Description" variant="outlined" />
            <Autocomplete
                disablePortal
                id="donator"
                options={donators}
                renderInput={(params) => <TextField {...params} label="Donator" />}
            />
            <TextField id="price" label="Price" variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
            <Button type="submit" variant="contained" >Create</Button>
        </Box>
    )
}