import { UserSession } from "@/app/types/userSession";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authConfig } from "../../../../../lib/authConfigs";


// Get all messages for a session
export async function GET(req: Request, context: { params: Promise<{ id: string }>; }) {
  const session: UserSession | null = await getServerSession(authConfig);
  const { params } = context;
  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const paramResults = await params;
    const sessionId = paramResults.id

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: Number(sessionId) },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}