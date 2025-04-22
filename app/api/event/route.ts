import prisma from "@/lib/prisma";

export const GET = async () => {
    const teachers = await prisma.event.findMany({
        orderBy: {
            createdAt: 'desc'
        },
    });
    return Response.json({ teachers })
}

