import { AnnotationDelta } from "openai/resources/beta/threads/messages.mjs";

export interface Metadata {
  annotation: AnnotationDelta[]
}