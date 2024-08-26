import { Suspense } from "react";
import Loading from "./loading";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Add from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { SearchableTable } from "@/components/SearchableTable";
import { getItems } from "./action";

export default function Items() {
    return (
        <>
            <Typography variant="h5" sx={{ marginBottom: 5 }}>
                Items
            </Typography>
            <Paper>
                <Toolbar>
                    <Link variant="button" href="/items/add" color="inherit">
                        <IconButton aria-label="delete" color="inherit">
                            <Add />
                        </IconButton>
                    </Link>
                </Toolbar>

                <Divider />

                <Suspense fallback={<Loading />}>
                    <SearchableTable
                        dataSource={getItems}
                        keys={["id", "description", "price", "stock", "donator"]}
                    />
                </Suspense>
            </Paper>
        </>
    );
}
