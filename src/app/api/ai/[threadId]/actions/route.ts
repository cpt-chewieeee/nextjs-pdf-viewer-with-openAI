import openai from "../../../../../../lib/openai";

// Send a new message to a thread
export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  const { toolCallOutputs, runId } = await request.json();
  const paramResult = await params;
  const id = paramResult.threadId;
  const stream = openai.beta.threads.runs.submitToolOutputsStream(
    id,
    runId,
    // { tool_outputs: [{ output: result, tool_call_id: toolCallId }] },
    { tool_outputs: toolCallOutputs }
  );

  return new Response(stream.toReadableStream());
}
