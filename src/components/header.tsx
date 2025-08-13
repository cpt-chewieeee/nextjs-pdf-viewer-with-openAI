
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { MouseEventHandler } from "react";


export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // const loading = status === 'loading';

  const handleLogout: MouseEventHandler<HTMLButtonElement> = (event) => {
    signOut();
    router.push('/')
    router.refresh();
    
  }
 
  return (
    <>
      {
        (session === undefined || session === null) ?
        null
        : <header className="absolute top-0 left-0 right-0 bg-blue-500 p-4 text-white z-10 bg-slate-900">

          <div className='flex justify-between items-center'>
            <span>
              <small>Signed in as</small>
              <br />
              <strong>{session?.user?.name || session?.user?.email}</strong>
            </span>
            <button
              onClick={handleLogout} 
              className="font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              Logout
            </button>
          </div>
       
        </header>
      }
    </>
    
  )
}