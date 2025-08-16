import { getServerSession } from "next-auth";
import { authConfig } from "../../../../lib/authConfigs";
import { NextResponse } from "next/server";
import { UserSession } from "@/app/types/userSession";



// Create new chat session
export async function POST (req: Request) {

  const session: UserSession | null = await getServerSession(authConfig);
  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { userId, title } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const session = await prisma.chatSession.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create message'}, { status: 500 });
  }
}


// Get all sessions for a user
export async function GET(req: Request) {
  const session: UserSession | null = await getServerSession(authConfig);
  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id;
    const sessions = await prisma.chatSession.findMany({
      where: {userId: Number(userId)},
      include: { messages: true },
      orderBy: { updatedAt: 'desc' } 
    });

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}