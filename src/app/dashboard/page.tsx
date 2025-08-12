import { getServerSession } from "next-auth";
import { authConfig } from "../../../lib/authConfigs";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authConfig);

  if(!session) {
    redirect('/login');
  }
  return (
    <div>hello world from dashboard</div>
  )
}