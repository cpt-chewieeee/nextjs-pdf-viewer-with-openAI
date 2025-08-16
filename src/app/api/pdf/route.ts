import { NextResponse } from 'next/server';
import { pinata } from '../../../../lib/pinata';
import prisma from '../../../../lib/prisma';
import { getServerSession } from "next-auth/next";
import { authConfig } from '../../../../lib/authConfigs';
import { UserSession } from '@/app/types/userSession';
import { PdfUpload } from '@prisma/client/edge';

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
    const { cid } = await pinata.upload.public.file(file);
    
    const url = await pinata.gateways.public.convert(cid);
    await prisma.pdfUpload.create({
      data: {
        filename: file.name,
        sizeBytes: file.size,
        cid: cid,
        fullUrl: url,

        uploadedBy: session.user.id
      }
    })
    return NextResponse.json(url, { status: 200 });
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