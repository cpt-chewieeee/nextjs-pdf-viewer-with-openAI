import { PdfUpload } from "./PdfUpload";

export type onSubmitEventCallback = (event: React.FormEvent<HTMLFormElement>) => void;
export type validateFormCallback = () => void;

export type selectFileCallback = (file: PdfUpload | null) => void;