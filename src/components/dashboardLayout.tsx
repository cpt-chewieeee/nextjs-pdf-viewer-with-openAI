import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AppLayout from "./appLayout";


export default function DashboardLayout() {
  const { data: session, status } = useSession();

  switch(status) {
    case 'loading':
      return (<div>loading</div>);
    case 'unauthenticated':
      redirect('/');
      return null;
    
    case 'authenticated':
        return (
          <div className="mt-20">
            <AppLayout>
              <div className="grid grid-cols-5 grid-rows-5 gap-4">
                <div className="row-span-5">1</div>
                <div className="col-span-3 row-span-4">2</div>
                <div className="col-span-3 col-start-2 row-start-5">3</div>
                <div className="row-span-5 col-start-5 row-start-1">4</div>
              </div>
            </AppLayout>
          </div>
        );
    default: 
      return null;
  }


}