"use client";

import { SessionProvider } from "next-auth/react";

import DashboardLayout from "../../components/dashboardLayout";

export default function Dashboard() {

  return (
    <SessionProvider>
      <DashboardLayout />
    </SessionProvider>
  )
}