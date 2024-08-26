"use client";

import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { SearchableTable } from "@/components/SearchableTable";
import { getTransactions } from "./action";

type Transaction = Awaited<ReturnType<typeof getTransactions>>["values"][0];

export default function TransactionsList() {
    const itemsRenderer = (transaction: Transaction) => (
        <ul>
            {transaction.itemsSerialized.map((serializedItem, index) => (
                <li key={index}>{serializedItem}</li>
            ))}
        </ul>
    );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h5" sx={{ marginBottom: 5 }}>
                Transactions
            </Typography>

            <Paper>
                <SearchableTable
                    dataSource={getTransactions}
                    keys={["id", "paymentMethod", "totalPrice"]}
                    additionalColumns={[["items", itemsRenderer]]}
                />
            </Paper>
        </Box>
    );
}
