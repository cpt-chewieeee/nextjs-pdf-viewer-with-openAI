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
    const userId = session.user.id;
    const data = await req.formData();

    const newSession = await prisma.chatSession.create({
      data: {
        userId,
        title: data.get('title'),
        pdfUploadId: Number(data.get('pdfUploadId'))
      },
    });
    return NextResponse.json(newSession, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create message'}, { status: 500 });
  }
}

