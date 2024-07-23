'use client'

import { createItem, getDonators } from "@/app/action";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState, useRef } from "react";
import Loading from "../loading";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import { useFormState } from "react-dom";
import Alert from "@mui/material/Alert";

export type AddItemFormState = {
    errors?: string
    success?: string
}

export default function AddItem() {
    const [donators, setDonators] = useState<string[]>([])
    const [donatorValue, setDonatorValue] = useState<string | null>(null)
    const [state, handleForm] = useFormState(createItem, {})
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        (async () => {
            const donators = await getDonators()
            setDonators(donators.map(donator => donator.name))
        })()
    }, [])

    useEffect(() => {
        if (state.success && formRef.current) {
            formRef.current.reset(); 
            setDonatorValue(null); 
        }
    }, [state.success])

    if (donators.length === 0) {
        return <Loading />
    }

    return (
        <Box component="form" display='flex' sx={{ flexDirection: 'column', gap: 4, justifyContent: 'space-between', maxWidth: 'md' }} action={handleForm} ref={formRef}>
            {state.errors && <Alert severity="error">{state.errors}</Alert>}
            {state.success && <Alert severity='success'>{state.success}</Alert>}

            <TextField name="id" label="ID" variant="outlined" />
            <TextField name="description" label="Description" variant="outlined" />
            <Autocomplete
                disablePortal
                options={donators}
                value={donatorValue}
                onChange={(event, newValue) => setDonatorValue(newValue)}
                renderInput={(params) => <TextField name="donator" {...params} label="Donator" />}
            />
            <TextField name="price" type="number" label="Price" variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
            <Button type="submit" variant="contained">Create</Button>
        </Box>
    )
}
