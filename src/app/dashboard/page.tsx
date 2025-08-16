"use client";

import { SessionProvider } from "next-auth/react";

import DashboardLayout from "../../components/dashboardLayout";

import './dashboard.css';
import { useState } from "react";
import { PdfUploadType } from "../types/PdfUploadType";
import { ChatType } from '../types/ChatType';
export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<PdfUploadType | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatType[]>([]);
  return (
    <SessionProvider>
      <DashboardLayout 
        chatHistory={chatHistory}
        setSelectedFile={(file:PdfUploadType | null) => { setSelectedFile(file); }} 
        selectedFile={selectedFile}/>
    </SessionProvider>
  )
}