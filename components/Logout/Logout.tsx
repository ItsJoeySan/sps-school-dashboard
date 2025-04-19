'use client'
import { authClient } from '@/lib/auth-client';
import React from 'react'
import {useRouter} from "next/navigation"

const Logout = () => {
    const router = useRouter()
    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/login"); // redirect to login page
              },
            },
          });
    }
  return (
    <div className='flex items-center justify-center min-h-1/2'>

        <button className="bg-amber-300 px-2 py-1 mt-2 rounded-lg" onClick={handleLogout}>Logout</button>

    </div>
  )
}

export default Logout