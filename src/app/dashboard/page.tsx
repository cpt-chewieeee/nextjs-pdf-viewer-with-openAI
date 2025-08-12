import { getServerSession } from "next-auth";
import { authConfig } from "../../../lib/authConfigs";
import { redirect } from "next/navigation";
import Layout from "../layout";
import { SessionProvider } from "next-auth/react";

export default async function Dashboard() {
  const session = await getServerSession(authConfig);

  if(!session) {
    redirect('/login');
  }
  return (
    <SessionProvider>
      <Layout>
        <div>hello world from dashboard</div>
      </Layout>
    </SessionProvider>
  )
}