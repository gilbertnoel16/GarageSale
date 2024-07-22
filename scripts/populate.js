const fs = require('fs')
const { PrismaClient } = require('@prisma/client')

const file = fs.readFileSync('./migrate.tsv', 'utf-8')
const rows = file.split('\n')
const items = rows.map(row => {
    const columns = row.split('\t')
    const [id, description, donator, priceString] = columns
    const price = priceString.substring(1, priceString.length)
    return {
        id,
        description,
        donator: donator.trimStart().trimEnd(),
        price,
    }
})

const prisma = new PrismaClient()
for (const item of items) {
    prisma.item.create({
        data: {
            id: item.id,
            description: item.description,
            price: item.price,
            stock: 1,
            donator: {
                connectOrCreate: {
                    where: {
                        name: item.donator,
                    },
                    create: {
                        name: item.donator,
                    },
                },
            }
        }
    }).catch(e => {
        console.error('Failed to create', item.id)
        console.error(e)
    })
}
