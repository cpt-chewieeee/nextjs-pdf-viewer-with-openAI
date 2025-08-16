import { getServerSession } from "next-auth";
import { authConfig } from "../../../../lib/authConfigs";
import { NextResponse } from "next/server";



export async function POST (req: Request) {

  // const session = await getServerSession(authConfig);
  // if(session === null || session === undefined) {
  //   return NextResponse.json(
  //     { error: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }
}