import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AppLayout from "./appLayout";
import PdfList from "./DashboardWidget/PdfList";
import PdfViewer from "./DashboardWidget/PdfViewer";
import ChatHistoryList from "./DashboardWidget/ChatHistoryList";
import Chat from "./DashboardWidget/Chat";
import { useState } from "react";
import { PdfUpload } from "@prisma/client/edge";



export default function DashboardLayout() {
  const { data: session, status } = useSession();

  const [selectedFile, setSelectedFile] = useState<PdfUpload | null>(null);


 

  switch(status) {
    case 'loading':
      return (<div className="flex items-center justify-center h-screen">
        <p className="text-center">Loading...</p>
      </div>);
    case 'unauthenticated':
      redirect('/');
      return null;
    
    case 'authenticated':
        return (
          <div className="pt-20 h-full">
            <AppLayout>
              <div className="grid grid-cols-6 grid-rows-6 gap-1 h-full">
                  <div className="row-span-6"><PdfList setSelectedFile={setSelectedFile}/></div>
                  <div className="col-span-3 row-span-6"><PdfViewer selectedFile={selectedFile} setSelectedFile={setSelectedFile}/></div>
                  <div className="col-span-2 row-span-2 col-start-5"><ChatHistoryList selectedFile={selectedFile}/></div>
                  <div className="col-span-2 row-span-4 col-start-5 row-start-3"><Chat /></div>
              </div>
            </AppLayout>
          </div>
        );
    default: 
      return null;
  }


}