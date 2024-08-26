"use client";

import { DEFAULT_PAGE_SIZE } from "@/config";
import SearchRounded from "@mui/icons-material/SearchRounded";
import InputAdornment from "@mui/material/InputAdornment";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { ReactNode, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export type IdentifiableObject = {
  id: string;
};

export type ExtensibleObject = {
  [key: string]: ReactNode;
};

export type Item = IdentifiableObject & ExtensibleObject;

export type DataSource<T> = (
  page: number,
  search?: string
) => Promise<{ values: T[]; totalRecordCount: number }>;

export type SearchableTableProps<T extends Item> = {
  keys: string[];
  dataSource: DataSource<T>;
  additionalColumns?: [string, (item: T) => ReactNode][];
};

export function SearchableTable<T extends Item>({
    keys,
    dataSource,
    additionalColumns,
}: SearchableTableProps<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>("");
    const handleSearch = useDebouncedCallback((search: string) => {
        setPage(0);
        setSearch(search);
    }, 1000);

    useEffect(() => {
        (async () => {
            const { values, totalRecordCount } = await dataSource(page, search);
            setTotalPages(Math.ceil(totalRecordCount / DEFAULT_PAGE_SIZE));
            setItems(values);
        })();
    }, [dataSource, page, search]);

    return (
        <>
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
                onChange={(e) => handleSearch(e.target.value)}
            />

            <TableContainer>
                <Table aria-label="Items">
                    <TableHead>
                        <TableRow>
                            {keys
                                .concat(additionalColumns?.map(([column, _]) => column) ?? [])
                                .map((key) => (
                                    <TableCell key={key}>{key}</TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                {keys.map((key) => (
                                    <TableCell key={`${item.id}-${key}`}>{item[key]}</TableCell>
                                ))}
                                {additionalColumns?.map(([columnName, renderer]) => (
                                    <TableCell key={`${item.id}-${columnName}}`}>
                                        {renderer(item)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    onChange={(_, page) => {
                        setPage(page - 1);
                    }}
                />
            )}
        </>
    );
}
