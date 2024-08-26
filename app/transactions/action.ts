"use server";

import { DEFAULT_PAGE_SIZE } from "@/config";
import prisma from "@/db";
import { Prisma } from "@prisma/client";

export async function getTransactions(page: number, search?: string) {
    const whereClause: Prisma.TransactionWhereInput =
    search !== undefined
        ? {
            TransactionItem: {
                some: {
                    item: {
                        id: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            },
        }
        : {};

    const totalRecordCount = await prisma.transaction.count({ where: whereClause });

    const transactions = await prisma.transaction.findMany({
        where: whereClause,
        skip: page * DEFAULT_PAGE_SIZE,
        take: DEFAULT_PAGE_SIZE,
        include: {
            TransactionItem: {
                include: {
                    item: true,
                },
            },
        },
    });

    const values = transactions.map((transaction) => ({
        id: transaction.id.toString(),
        paymentMethod: transaction.paymentMethod,
        totalPrice: transaction.totalPrice.toNumber(),
        itemsSerialized: transaction.TransactionItem.map(
            (transactionItem) =>
                `${transactionItem.itemId} - ${transactionItem.item.description} (${transactionItem.quantity})`
        ),
    }));

    return {
        values,
        totalRecordCount,
    };
}
