import { UserSession } from "@/app/types/userSession";
import { ChatMessage } from "@prisma/client/index-browser";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authConfig } from "../../../../lib/authConfigs";
import prisma from '../../../../lib/prisma';


export async function POST(req: Request) {
  const session: UserSession | null = await getServerSession(authConfig);

  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  

  try {
    const chatMessage: ChatMessage = await req.json();

    const newMessage = await prisma.chatMessage.create({
      data: chatMessage
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    
    return NextResponse.json({ error: "Failed save OpenAI's response" }, { status: 500 });
  }
}