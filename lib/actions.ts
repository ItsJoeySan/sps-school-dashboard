"use server";

import { revalidatePath } from "next/cache";
import {
  AlumniSchema,
  ClassSchema,
  EventSchema,
  ExamSchema,
  JobSchema,
  ResourceSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
  UserSchema,
} from "./formValidationSchemas";
import type { Student } from "@/generated/prisma";
import prisma from "./prisma";
import { authClient } from "./auth-client";
import { connect } from "http2";
import { auth } from "./auth";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers?.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers?.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const teacher = await prisma.teacher.create({
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.image,
        bloodType: data.bloodType,
        qualification: data.qualification,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: subjectId,
          })),
        },
        User: {
          connect: {
            id: data.id,
          },
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.image,
        bloodType: data.bloodType,
        qualification: data.qualification,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: subjectId,
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    console.log(id);
    await prisma.user.delete({
      where: {
      id
      },
    }
  );

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }
    //you need to fix this
    const user = await prisma.student.create({
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.image as string,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentName: data.parentName,
        userId: data.id as string,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        image: data.image as string,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentName: data.parentName,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: id,
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// EVENTS //

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  //in future check the permission

  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        startTime: data.startTime,
        endTime: data.endTime,
        // class: {
        //   connect:  data.class?.map((classId) => ({id: classId}))
        //   }
        // }
      },
    });

    // revalidatePath("/list/Events");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  //in future check the permission

  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        startTime: data.startTime,
        endTime: data.endTime,
        // class: {
        //   connect:  data.class?.map((classId) => ({id: classId}))
        //   }
        // }
      },
    });

    // revalidatePath("/list/Events");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.event.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/Events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Resource
export const createResouce = async (
  currentState: CurrentState,
  data: ResourceSchema
) => {
  //in future check the permission

  try {
    await prisma.resource.create({
      data: {
        title: data.title,
        file: data.file as string,
      },
    });

    // revalidatePath("/list/Events");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const updateResouce = async (
  currentState: CurrentState,
  data: ResourceSchema
) => {
  //in future check the permission

  try {
    await prisma.resource.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        file: data.file,
      },
    });

    // revalidatePath("/list/Resource");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteResource = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.resource.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/resources");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Alumni
export const createAlumni = async (
  currentState: CurrentState,
  data: AlumniSchema
) => {
  //in future check the permission

  try {
    await prisma.alumni.create({
      data: {
        name: data.name,
        designation: data.designation,
        batch: data.batch,
        image: data.image as string,
      },
    });

    // revalidatePath("/list/alumni");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const updateAlumni = async (
  currentState: CurrentState,
  data: AlumniSchema
) => {
  //in future check the permission

  try {
    await prisma.alumni.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        designation: data.designation,
        batch: data.batch,
        image: data.image as string,
      },
    });

    // revalidatePath("/list/alumni");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteAlumni = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.alumni.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/alumni");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


//Job
export const createJob = async (
  currentState: CurrentState,
  data: JobSchema
) => {
  //in future check the permission

  try {
    await prisma.job.create({
      data: {
        position: data.position,
        branch: data.branch,
        jobType: data.jobType,
        experience: data.experience,
        deadline: data.deadline,
      },
    });

    // revalidatePath("/list/job");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const updateJob = async (
  currentState: CurrentState,
  data: JobSchema
) => {
  //in future check the permission

  try {
    await prisma.job.update({
      where: {
        id: data.id,
      },
      data: {
        position: data.position,
        branch: data.branch,
        jobType: data.jobType,
        experience: data.experience,
        deadline: data.deadline,
      },
    });

    // revalidatePath("/list/job");
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const deleteJob = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.job.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/job");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


