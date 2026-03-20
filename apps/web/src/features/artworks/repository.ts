import type { Artwork, ArtworkInput } from "@/features/artworks/types";

export interface ArtworkRepository {
  listPublic(): Promise<Artwork[]>;
  listAll(): Promise<Artwork[]>;
  getBySlug(slug: string): Promise<Artwork | null>;
  getById(id: string): Promise<Artwork | null>;
  create(input: ArtworkInput): Promise<Artwork>;
  update(id: string, input: ArtworkInput): Promise<Artwork>;
  delete(id: string): Promise<void>;
  reorder(idsInOrder: string[]): Promise<Artwork[]>;
}
