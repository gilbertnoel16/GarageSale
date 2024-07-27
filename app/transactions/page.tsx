"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { getTransactions } from "../action";
import Loading from "../items/loading"; // Assuming there is a loading component

type TransactionWithItems = {
  id: number;
  createdAt: Date;
  totalPrice: number;
  paymentMethod: string;
  TransactionItem: {
    item: {
      id: string;
      description: string;
    };
    quantity: number;
  }[];
};

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<TransactionWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchTransactions() {
      const fetchedTransactions = await getTransactions();
      setTransactions(
        fetchedTransactions.map((fetchedTransaction) => ({
          ...fetchedTransaction,
          totalPrice: fetchedTransaction.totalPrice.toNumber(),
        }))
      );
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.TransactionItem.some((transactionItem) =>
      transactionItem.item.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 5 }}>
        Transactions
      </Typography>
      <TextField
        id="search"
        label="Search by Item ID"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          ),
        }}
        variant="standard"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ marginBottom: 4 }}
      />
      <Paper>
        <TableContainer>
          <Table aria-label="Transactions">
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Items Purchased</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Time Recorded</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>
                    {transaction.TransactionItem.map(
                      (transactionItem, index) => (
                        <div key={index}>
                          {transactionItem.item.id} -{" "}
                          {transactionItem.item.description} (Quantity:{" "}
                          {transactionItem.quantity})
                        </div>
                      )
                    )}
                  </TableCell>
                  <TableCell>${transaction.totalPrice}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
