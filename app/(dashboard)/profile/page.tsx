
import StudentPage from '@/components/Student/Student';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Logout from '@/components/Logout/Logout';
import AdminProfilePage from '@/components/Admin/AdminProfile';
import TeacherProfilePage from '@/components/Teacher/TeacherProfile';
import StudentProfilePage from '@/components/Student/StudentProfile';

const Home =  async (props: {
    searchParams: Promise<{ [keys: string]: string | undefined }>
  }) => {
      const session = await auth.api.getSession({
        headers: await headers()
    });
    const role = session?.user.role;
  return (
        role === 'admin' ?  <AdminProfilePage /> : role ==="teacher" ? <TeacherProfilePage /> : role === "student" ? <StudentProfilePage /> : <div className='flex h-1/3 items-center justify-center'><div className='bg-white p-4 rounded-2xl shadow'><div className='bg-wh'>Access forbidden!</div> <Logout /></div></div>
  )
}

export default Home