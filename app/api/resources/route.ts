import prisma from "@/lib/prisma";

export const GET = async () => {
    const resources = await prisma.resource.findMany({
        orderBy: {
            createdAt: 'desc'
        },
    });
    return Response.json({ resources })
}

