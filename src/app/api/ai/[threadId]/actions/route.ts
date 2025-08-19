import openai from "../../../../../../lib/openai";

// Send a new message to a thread
export async function POST(request: Request, context: { params: Promise<{ threadId: string }>; }) {
  const { toolCallOutputs, runId } = await request.json();
  const { params } = context;
  const paramResult = await params;
  const id = paramResult.threadId;
  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    id,
    runId,
    // @ts-expect-error: this is working, but typescript is not able to detect
    { tool_outputs: toolCallOutputs } 
  );

  return new Response(stream.toReadableStream());
}
