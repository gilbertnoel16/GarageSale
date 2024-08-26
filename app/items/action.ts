"use server";

import { DEFAULT_PAGE_SIZE } from "@/config";
import prisma from "@/db";
import { Prisma } from "@prisma/client";

export async function getItems(page: number, search?: string) {
    const whereClause: Prisma.ItemWhereInput =
    search != undefined
        ? {
            id: {
                contains: search,
                mode: "insensitive",
            },
        }
        : {};

    const totalRecordCount = await prisma.item.count({
        where: whereClause,
    });

    const items = await prisma.item.findMany({
        skip: page * DEFAULT_PAGE_SIZE,
        take: DEFAULT_PAGE_SIZE,
        where: whereClause,
        include: {
            donator: {
                select: {
                    name: true,
                },
            },
        },
    });

    const values = items.map((item) => ({
        id: item.id,
        description: item.description,
        donator: item.donator?.name,
        stock: item.stock,
        price: item.price?.toNumber(),
    }));

    return {
        values,
        totalRecordCount,
    };
}
