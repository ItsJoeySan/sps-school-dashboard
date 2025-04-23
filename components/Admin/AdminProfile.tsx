import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { Class, Student } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EventCalendar from "../EventCalendar";
import UserCard from "../UserCard";
import CountChartContainer from "../CountChartContainer";
import AttendanceChartContainer from "../AttendanceChartContainer";

const AdminProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user.role as string;
  const id = session?.user.id as string;

  const admin = await prisma.user.findUnique({
    where: { id },
  });

  if (!admin) {
    return notFound();
  }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">

      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-joeySky py-6 px-4 rounded-md flex-1 flex gap-4">
          <div className="w-1/3">
            <Image
              src={admin?.image || "/noAvatar.png"}
              alt=""
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className="w-2/3 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                {admin.name + " " + admin.surname}
              </h1>
              {/* {role === "admin" && (
                  <FormContainer table="student" type="update" data={admin} />
                )} */}
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                <Image src="/mail.png" alt="" width={14} height={14} />
                <span>{admin.email || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          {/* <UserCard type="parent" /> */}
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">{/* <FinanceChart /> */}</div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminProfilePage;
