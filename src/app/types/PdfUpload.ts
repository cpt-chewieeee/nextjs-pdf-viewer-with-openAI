export type PdfUpload = {
  id: number;
  filename: string;

  sizeBytes: number;
  cid: string;
  fullUrl: string;
  uploadedBy: number;

  createdAt: string;
}