'use server'

import prisma from "@/db"

export async function getDonators() {
    return prisma.donator.findMany();
}
