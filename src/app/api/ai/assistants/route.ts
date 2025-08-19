import { NextResponse } from "next/server";
import openai from "../../../../../lib/openai";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: "You are a helpful assistant.",
    name: "nextjs-pdf-viewer-assistant",
    model: "gpt-4o",
    tools: [
      { type: "code_interpreter" },
      
      { type: "file_search" },
    ],
  });
  return NextResponse.json({ assistantId: assistant.id });
}
