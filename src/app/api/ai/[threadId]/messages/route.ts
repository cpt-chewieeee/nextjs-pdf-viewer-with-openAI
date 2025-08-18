import openai from "../../../../../../lib/openai";

// Send a new message to a thread
export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  const { content, assistantId } = await request.json();
  const paramResult = await params;

  const id = paramResult.threadId;

  await openai.beta.threads.messages.create(id, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(id, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
