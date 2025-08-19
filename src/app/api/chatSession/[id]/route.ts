import { getServerSession } from "next-auth";
import { authConfig } from "../../../../../lib/authConfigs";
import { NextResponse } from "next/server";
import { UserSession } from "@/app/types/userSession";
import prisma from '../../../../../lib/prisma';


// Get all sessions for a user
export async function GET(req: Request, context: { params: Promise<{ id: string }>; }) {
  const session: UserSession | null = await getServerSession(authConfig);
  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const { params } = context;
  try {
    const userId = session.user.id;
    const paramResults = await params;
    const sessions = await prisma.chatSession.findMany({
      where: {
        AND: [
          {
            userId: Number(userId)
          },
          {
            pdfUploadId: Number(paramResults.id)
          }
        ]
      },
      // include: { messages: true },
      orderBy: { updatedAt: 'desc' } 
    });

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}