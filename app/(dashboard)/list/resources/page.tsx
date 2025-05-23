import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Resource, Prisma } from "@/generated/prisma";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

type ResourceList = Resource;
const Resources = async (props: {
  searchParams: Promise<{ [keys: string]: string | undefined }>;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = session?.user.id;
  const role = session?.user.role as string;
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "File",
      accessor: "file",
    },

    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ResourceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-joeyPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td className="hidden md:table-cell"><Link href={item.file} target="_blank" download={item.title}>Download File</Link></td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="resource" type="update" data={item} />
              <FormContainer table="resource" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = await props.searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResourceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // // ROLE CONDITIONS

  // const roleConditions = {
  //   teacher: { lessons: { some: { teacherId: currentUserId! } } },
  //   student: { students: { some: { id: currentUserId! } } },
  //   // parent: { students: { some: { parentId: currentUserId! } } },
  // };

  // query.OR = [
  //   { classId: null },
  //   {
  //     class: roleConditions[role as keyof typeof roleConditions] || {},
  //   },
  // ];

  const [data, count] = await prisma.$transaction([
    prisma.resource.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.resource.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Resources</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-joeyYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-joeyYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="resource" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default Resources;
