import prisma from "@/lib/prisma";

export const GET = async () => {
    const jobs = await prisma.job.findMany({
        orderBy: {
            createdAt: 'desc'
        },

    });
    return Response.json({ jobs })
}

