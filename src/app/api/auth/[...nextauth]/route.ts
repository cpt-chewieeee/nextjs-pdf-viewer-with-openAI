
import NextAuth from "next-auth";
import { authConfig } from "../../../../../lib/authConfigs";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };


declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
declare module "next-auth" {
  interface Session {
    user: { id: string; name: string; email: string };
    // user: { id: string };
  }
}
