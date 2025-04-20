import prisma from "@/lib/prisma";

export const GET = async () => {
    const teachers = await prisma.teacher.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            subjects: true
        }
    });
    return Response.json({ teachers })
}

