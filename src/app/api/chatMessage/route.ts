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
    const { sessionId, role, content } = await req.json();

    if (!sessionId || !role || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}

// Get all messages for a session
export async function GET(req: Request) {
  const session: UserSession | null = await getServerSession(authConfig);
  
  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: Number(sessionId) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}