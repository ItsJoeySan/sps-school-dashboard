import AdminPage from '@/components/Admin/Admin';
import StudentPage from '@/components/Student/Student';
import Teacher from '@/components/Teacher/Teacher';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Logout from './logout/page';

const Home =  async (props: {
    searchParams: Promise<{ [keys: string]: string | undefined }>
  }) => {
      const session = await auth.api.getSession({
        headers: await headers()
    });
    const role = session?.user.role;
  return (
        role === 'admin' ?  <AdminPage searchParams={props.searchParams} /> : role ==="teacher" ? <Teacher /> : role === "student" ? <StudentPage /> : <div className='flex items-center justify-center'><div>Access forbidden!</div> <Logout /></div>
  )
}

export default Home