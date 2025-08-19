import { getServerSession } from "next-auth";
import { authConfig } from "../../../../lib/authConfigs";
import { NextResponse } from "next/server";
import { UserSession } from "@/app/types/userSession";
import openai from "../../../../lib/openai";
import prisma from '../../../../lib/prisma';


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
    const userId = session.user.id;
    const data = await req.json();

    const thread = await openai.beta.threads.create();

    const newSession = await prisma.chatSession.create({
      data: {
        userId,
        title: data.title,
        pdfUploadId: Number(data.pdfUploadId),
        threadId: thread.id,
      },
    });
    return NextResponse.json(newSession, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create message'}, { status: 500 });
  }
}

