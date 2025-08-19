import openai from "../../../../../../lib/openai";

// Send a new message to a thread
export async function POST(request: Request, context: { params: Promise<{ threadId: string }>; }) {
  const { content, assistantId, sessionId } = await request.json();
  const { params } = context;
  const paramResult = await params;

  const id = paramResult.threadId;

  await openai.beta.threads.messages.create(id, {
    role: "user",
    content: content,
  });
  await prisma.chatMessage.create({
    data: {
      sessionId: Number(sessionId),
      content: content
    }
  })

  const stream = openai.beta.threads.runs.stream(id, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
