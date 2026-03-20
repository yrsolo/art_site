import { redirect } from "next/navigation";

import { defaultVariantId } from "@/features/variants/manifests";

type ArtworkRedirectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArtworkRedirectPage({ params }: ArtworkRedirectPageProps) {
  const { slug } = await params;
  redirect(`/${defaultVariantId}/artwork/${slug}`);
}
