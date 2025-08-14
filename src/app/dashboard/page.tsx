"use client";

import { SessionProvider } from "next-auth/react";

import DashboardLayout from "../../components/dashboardLayout";

import './dashboard.css';
import { useState } from "react";
import { PdfUpload } from "../types/PdfUpload";
export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<PdfUpload | null>(null);
  return (
    <SessionProvider>
      <DashboardLayout setSelectedFile={(file:PdfUpload) => { setSelectedFile(file); }} selectedFile={selectedFile}/>
    </SessionProvider>
  )
}