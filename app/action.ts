'use server'

import prisma from "@/db"
import { Item } from "@prisma/client";
import { AddItemFormState } from "./items/add/page";
import { Decimal } from "@prisma/client/runtime/library";


export async function getDonators() {
    return prisma.donator.findMany();
}

function itemFormToItemAndDonator(formData: FormData): [Omit<Item, 'donatorId'>, string] {
    const id = formData.get('id');
    const description = formData.get('description');
    const price = formData.get('price')
    const donator = formData.get('donator')

    if (!id) {
        throw new Error("ID is required");
    }

    if (!description) {
        throw new Error("Description is required");
    }

    if (!price) {
        throw new Error("Price is required");
    }

    if (!donator) {
        throw new Error("Donator is required");
    }

    return [
        {
            id: id as string,
            description: description as string,
            price: price.valueOf() as Decimal,
            stock: 1
        },
        donator as string
    ]
}

export async function createItem(_: AddItemFormState, payload: FormData): Promise<AddItemFormState> {
    try {
        const [item, donator] = itemFormToItemAndDonator(payload);

        await prisma.item.create({
            data: {
                ...item,
                donator: {
                    connectOrCreate: {
                        where: { name: donator },
                        create: { name: donator }
                    }
                }
            }
        })
        return {
            success: `Successfully created ${item.id}`
        }
    } catch (e) {
        if (e instanceof Error) {
            return { errors: e.message }
        }
    }

    return {}
}

export async function getItems(filter?: string) {
    if (filter) {
        const items = await prisma.item.findMany({
            where: {
                id: {
                    contains: filter,
                    mode: 'insensitive'
                }
            },
            include: {
                donator: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return items.map(item => ({
            ...item,
            price: item.price.toNumber()
        }))
    }

    const items = await prisma.item.findMany({
        include: {
            donator: {
                select: {
                    name: true
                }
            }
        }
    });

    return items.map(item => ({
        ...item,
        price: item.price.toNumber()
    }))
}

export async function getInStockItems(filter?: string) {
    if (filter) {
        const items = await prisma.item.findMany({
            where: {
                id: {
                    contains: filter,
                    mode: 'insensitive'
                },
                stock: {
                    gt: 0
                }
            },
            include: {
                donator: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return items.map(item => ({
            ...item,
            price: item.price.toNumber()
        }))
    }
    

    const items = await prisma.item.findMany({
        where: {
            stock: {
                gt: 0
            }
        },
        include: {
            donator: {
                select: {
                    name: true
                }
            }
        }
    });

    return items.map(item => ({
        ...item,
        price: item.price.toNumber()
    }));
}

export async function addTransaction(cart: any[], totalPrice: number, paymentMethod: string): Promise<{ success?: string; errors?: string }> {
    try {
      // Log the data being sent to Prisma for debugging
      console.log("Creating transaction with data:", {
        totalPrice,
        paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
        })),
      });
  
      // Create the transaction with transaction items
      const transaction = await prisma.transaction.create({
        data: {
          totalPrice,
          paymentMethod,
          TransactionItem: {
            create: cart.map(item => ({
              itemId: item.id,
              quantity: item.quantity,
            })),
          },
        },
      });
  
      return {
        success: `Successfully created transaction ${transaction.id}`
      };
    } catch (e) {
      if (e instanceof Error) {
        console.error('Error creating transaction:', e.message);
        return { errors: e.message };
      }
    }
  
    return {};
}

export async function getTransactions() {
    const transactions = await prisma.transaction.findMany({
      include: {
        TransactionItem: {
          include: {
            item: true, // Include the related items for each transaction item
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return transactions;
  }

