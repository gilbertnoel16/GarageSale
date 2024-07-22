import prisma from "@/db";

export default async function Items() {
    const items = await prisma.item.findMany({
        take: 10
    })

    return <main><h1>Item</h1><ul>{items.map(item => <li key={item.id}>{item.id} - {item.description} - ${item.price.toString()}</li>)}</ul></main>
}