import prisma from "@/lib/prisma";
import FormModal from "./FormModal";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    // | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "alumni"
    | "resource"
    | "job";
  type: "create" | "update" | "delete";
  data?: any;
  id?: string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUserId = session?.user.id;
  const role = session?.user.role;

  // const session = await authClient.getSession()
  // const userId = session.data?.user.id
  // const role = session.data?.user.role

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
      case "event":
        const events = await prisma.event.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
        relatedData = { events: events };
        break;
      case "alumni":
        const alumnis = await prisma.alumni.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
        relatedData = { alumnis: alumnis };
        break;
      case "resource":
        const resources = await prisma.resource.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
        relatedData = { resources: resources };
        break;
        case "job":
          const jobs = await prisma.job.findMany({
            orderBy: {
              createdAt: "desc",
            },
          });
          relatedData = { jobs: jobs };
          break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
