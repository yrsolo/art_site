import { redirect } from "next/navigation";

import { defaultVariantId } from "@/features/variants/manifests";

export default function GalleryRedirectPage() {
  redirect(`/${defaultVariantId}/gallery`);
}
