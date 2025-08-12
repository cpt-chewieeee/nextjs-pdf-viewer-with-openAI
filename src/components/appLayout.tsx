import { AppProps } from "next/app";
import { ReactNode, FC } from 'react';
import Header from "./header";
interface LayoutProps {
  children: ReactNode
}
export default function AppLayout ({children}: LayoutProps) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
    </>
  );
}