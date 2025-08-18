import { UserSession } from "@/app/types/userSession";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authConfig } from "../../../../../lib/authConfigs";
import openai from '../../../../../lib/openai';


// Create new chat message
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session: UserSession | null = await getServerSession(authConfig);

  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { messages } = await req.json();
  const paramResults = await params;
  const sessionId = paramResults.id
  

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages
    });
    await prisma.chatMessage.create({
      data: {
        sessionId: Number(sessionId),
       
        content: messages[0].content[1].text,

        metadata: {}
      },
    });
    await prisma.chatMessage.create({
      data: {
        sessionId: Number(sessionId),
        content: response.choices[0].message.content,
        isReply: true,
        metadata: response.choices[0].message.annotations
      }
    })
    console.log('what is my response', response);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message to OpenAI" }, { status: 500 });
  }
}

// Get all messages for a session
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session: UserSession | null = await getServerSession(authConfig);
  
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