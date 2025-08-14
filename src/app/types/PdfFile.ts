type PdfUpload = {
  id: number;
  filename: string;

  sizeBytes: number;
  s3Key: number;
  s3Bucket: string;
  uploadedBy: string;

  createdAt: string;
}