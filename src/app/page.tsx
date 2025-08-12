'use client';

import Layout from "@/components/appLayout";
import WelcomePage from "./WelcomePage";
import { SessionProvider } from "next-auth/react";

export default function Root() {

  return (
    <SessionProvider>
   
      <WelcomePage />
  
    </SessionProvider>
  );
}
