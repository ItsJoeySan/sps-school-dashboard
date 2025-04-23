import prisma from "@/lib/prisma";

export const GET = async () => {
    const alumni = await prisma.alumni.findMany({
        orderBy: {
            createdAt: 'desc'
        },

    });
    return Response.json({ alumni })
}

