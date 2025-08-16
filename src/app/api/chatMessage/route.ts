import { UserSession } from "@/app/types/userSession";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authConfig } from "../../../../lib/authConfigs";
// Create new chat message
export async function POST(req: Request) {
  const session: UserSession | null = await getServerSession(authConfig);
  
  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const data = await req.formData();

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: Number(data.get('sessionId')),
       
        content: data.get('content'),

        metadata: {}
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}