import { redirect } from "next/navigation";

import { defaultVariantId } from "@/features/variants/manifests";

export default function AboutRedirectPage() {
  redirect(`/${defaultVariantId}/about`);
}
