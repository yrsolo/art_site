import type { ContentPageKey } from "@/features/content/types";

export type ContentFieldDefinition =
  | { key: string; label: string; type: "text" | "textarea" }
  | { key: string; label: string; type: "string-array" };

export const contentEditorSchemas: Record<ContentPageKey, ContentFieldDefinition[]> = {
  home: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Title", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "primaryCta", label: "Primary CTA", type: "text" },
    { key: "secondaryCta", label: "Secondary CTA", type: "text" },
  ],
  gallery: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Title", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  artwork: [
    { key: "inquiryLabel", label: "Inquiry CTA", type: "text" },
    { key: "note", label: "Detail note", type: "textarea" },
  ],
  about: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Title", type: "textarea" },
    { key: "paragraphs", label: "Paragraphs", type: "string-array" },
  ],
  contacts: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Title", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "channels", label: "Channels", type: "string-array" },
    { key: "inquiryLabel", label: "Inquiry CTA", type: "text" },
  ],
};
