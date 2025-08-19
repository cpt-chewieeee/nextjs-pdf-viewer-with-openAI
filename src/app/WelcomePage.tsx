import { useRouter } from "next/navigation";
import AppLayout from "@/components/appLayout";
import { useSession } from "next-auth/react";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const onLoginClick = () => {
    router.push('/Login')
  }
  const onRegisterClick = () => {
    router.push('/Registration')
  }
  const onDashboardClick = () => {
    router.push('/dashboard');
  }
  return (
    <AppLayout>
      <div className="relative isolate px-6 pt-20 lg:px-8 flex h-screen items-center justify-center">
        <div className="text-center block">
          <div className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            Next.js + PostgreSql + TailwindCss + LLM Pdf Demo
          </div>
          <br/>
          <div className="flex space-x-4 justify-center items-center">
            {
              (session === undefined || session === null) ?
              <>
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
              </>
              : <button
                onClick={onDashboardClick} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Go to Dashboard
              </button>
            }
          </div>
        </div>
      </div>
    </AppLayout>
  );
}