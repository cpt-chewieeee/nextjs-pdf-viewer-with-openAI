import { PdfUploadType } from "./PdfUploadType";

export type onSubmitEventCallback = (event: React.FormEvent<HTMLFormElement>) => void;
export type validateFormCallback = () => void;

export type selectFileCallback = (file: PdfUploadType | null) => void;