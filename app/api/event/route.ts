import prisma from "@/lib/prisma";

export const GET = async () => {
    const events = await prisma.event.findMany({
        orderBy: {
            createdAt: 'desc'
        },
    });
    return Response.json({ events })
}

