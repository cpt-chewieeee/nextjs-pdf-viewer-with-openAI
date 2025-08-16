"use client";
import { SessionProvider } from "next-auth/react";
import DashboardLayout from "../../components/dashboardLayout";
import './dashboard.css';
import { PdfUploadType } from "../types/PdfUploadType";

export default function Dashboard() {


  return (
    <SessionProvider>
      <DashboardLayout />
    </SessionProvider>
  )
}