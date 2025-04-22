import prisma from "@/lib/prisma";

export const GET = async () => {
    const teachers = await prisma.alumni.findMany({
        orderBy: {
            createdAt: 'desc'
        },
    });
    return Response.json({ teachers })
}

