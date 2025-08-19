import { NextResponse } from 'next/server';

import prisma from '../../../../lib/prisma';
import { getServerSession } from "next-auth/next";
import { authConfig } from '../../../../lib/authConfigs';
import { UserSession } from '@/app/types/userSession';
import { PdfUpload } from '@prisma/client/edge';
import openai from '../../../../lib/openai';
import { pinata } from '../../../../lib/pinata';


/* Helper functions */
const getOrCreateVectorStore = async (assistantId: string) => {
  const assistant: any = await openai.beta.assistants.retrieve(assistantId); // eslint-disable-line @typescript-eslint/no-explicit-any

  // if the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }
  // otherwise, create a new vector store and attatch it to the assistant
  const vectorStore = await openai.vectorStores.create({
    name: "nextjs-pdf-llm-demo",
  });
  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });
  return vectorStore.id;
};

export async function POST(request: Request) {
  const session: UserSession | null = await getServerSession(authConfig);

  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const assistantId: string = data.get('assistantId') as string;

    const vectorStoreId = await getOrCreateVectorStore(assistantId);
    const { cid } = await pinata.upload.public.file(file);
    const url = await pinata.gateways.public.convert(cid);
    const openaiFile = await openai.files.create({
      file: file,
      purpose: "assistants"
    });

    await openai.vectorStores.files.create(vectorStoreId, {
      file_id: openaiFile.id
    });

    const result = await prisma.pdfUpload.create({
      data: {
        uploadedBy: session.user.id,
        vectorStoreId: vectorStoreId,
        fileId: openaiFile.id,
        sizeBytes: file.size,
        assistantId: assistantId,
        filename: file.name,
        cid: cid,
        fullUrl: url
      }
    });
  
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

}

export async function GET(request: Request) {
  const session: UserSession | null = await getServerSession(authConfig);

  if(session === null || session === undefined) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const allPdfUploads: PdfUpload[] = await prisma.pdfUpload.findMany({
      where: {
        OR: [
          {
            isPublic: true
          },
          {
            uploadedBy: session.user.id
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(
      allPdfUploads,
      {
        status: 200
      }
    )
  } catch(e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}