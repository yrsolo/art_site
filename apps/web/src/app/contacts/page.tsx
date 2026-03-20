import { redirect } from "next/navigation";

import { defaultVariantId } from "@/features/variants/manifests";

export default function ContactsRedirectPage() {
  redirect(`/${defaultVariantId}/contacts`);
}
