import { z } from "zod";

export const subjectSchema = z.object({
  id: z.string().optional(), // Prisma uses String as the ID type
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()).optional(), // Array of Teacher IDs
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Class name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1!" }),
  gradeId: z.string().min(1, { message: "Grade ID is required!" }),
  supervisorId: z.string().optional(), // Supervisor is a Teacher
});

export type ClassSchema = z.infer<typeof classSchema>;


export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  image: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "gender is required!" }),
  // subjectIDs: z.array(z.string()).optional(), // IDs of Subjects
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;


export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  image: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  gender: z.enum(["MALE", "FEMALE"], { message: "gender is required!" }),
  gradeId: z.coerce.string().min(1, { message: "Grade is required!" }),
  classId: z.coerce.string().min(1, { message: "Class is required!" }),
  parentName: z.string().min(1, { message: "Parent name is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }).optional(),
  password: z.string().min(8, {message: "Password must be atleast 8 characters long!"}),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),
  phone: z.string().optional(),
  image: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"], { message: "gender is required!" }),
  role: z.string().optional(),
  // admin: AdminSchema.optional(),
  // parent: parentSchema.optional(),
  teacher: teacherSchema.optional(),
  student: studentSchema.optional(),
  
});

export type UserSchema = z.infer<typeof userSchema>;

export const examSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.string({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(10, {message: "Description is required!"}),
  category: z.string().min(1, {message: "Category is required!"}),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  classId: z.coerce.string().min(1, { message: "Class is required!" }),
});

export type EventSchema = z.infer<typeof eventSchema>;
