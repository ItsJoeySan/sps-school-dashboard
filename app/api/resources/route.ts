import prisma from "@/lib/prisma";

export const GET = async () => {
    const resources = await prisma.alumni.findMany({
        orderBy: {
            createdAt: 'desc'
        },
    });
    return Response.json({ resources })
}

