import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  const { filename, sizeBytes, s3Key, s3Bucket } = await req.json();

  const file = await prisma.pdfUpload.create({
    data: {
      filename, sizeBytes, s3Key, s3Bucket
    }
  });

  return NextResponse.json(file);
}