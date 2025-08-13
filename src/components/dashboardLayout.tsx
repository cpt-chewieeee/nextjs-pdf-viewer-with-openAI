import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AppLayout from "./appLayout";
import PdfList from "./DashboardWidget/PdfList";
import PdfViewer from "./DashboardWidget/PdfViewer";
import ChatHistoryList from "./DashboardWidget/ChatHistoryList";
import Chat from "./DashboardWidget/Chat";


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
          <div className="pt-20 h-full">
            <AppLayout>
              <div className="grid grid-cols-6 grid-rows-6 gap-1 h-full">
                  <div className="row-span-6"><PdfList /></div>
                  <div className="col-span-3 row-span-6"><PdfViewer /></div>
                  <div className="col-span-2 row-span-2 col-start-5"><ChatHistoryList /></div>
                  <div className="col-span-2 row-span-4 col-start-5 row-start-3"><Chat /></div>
              </div>
            </AppLayout>
          </div>
        );
    default: 
      return null;
  }


}