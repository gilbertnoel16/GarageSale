import { Suspense } from "react";
import Loading from "./loading";
import ItemsList from "./itemsList";
import Typography from "@mui/material/Typography";

export default function Items() {
    return (
        <>
            <Typography variant="h3">Items</Typography>
            <Suspense fallback={<Loading />}>
                <ItemsList />
            </Suspense>
        </>
    )
}