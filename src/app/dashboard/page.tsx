"use client";
import { SessionProvider } from "next-auth/react";
import DashboardLayout from "../../components/dashboardLayout";
import './dashboard.css';


export default function Dashboard() {


  return (
    <SessionProvider>
      <DashboardLayout />
    </SessionProvider>
  )
}