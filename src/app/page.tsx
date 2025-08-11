'use client';

import { useRouter } from "next/navigation";

export default function Root() {

  const router = useRouter();

  const onLoginClick = () => {
    router.push('/login')
  }
  const onRegisterClick = () => {
    router.push('/registration')
  }
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 flex h-screen items-center justify-center">
      <div className="text-center block">
        <div className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
          Next.js + PostgreSql + TailwindCss + LLM Pdf Demo
        </div>
        <br/>
        <div className="flex space-x-4 justify-center items-center">
          <button 
            onClick={onLoginClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
            Login
          </button>
          <button 
            onClick={onRegisterClick}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
            New user
          </button>
        </div>
      </div>
    </div>
  );
}
