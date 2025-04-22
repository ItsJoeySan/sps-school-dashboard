import prisma from "@/lib/prisma";

export const GET = async () => {
    const teachers = await prisma.job.findMany({
        orderBy: {
            createdAt: 'desc'
        },

    });
    return Response.json({ teachers })
}

