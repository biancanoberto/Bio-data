export interface ReferenceItem {
  id: string;
  name: string;
}

export interface ConservationStatusReference extends ReferenceItem {
  level: number;
  color: string | null;
}

export interface AnimalImage {
  id: string;
  altText: string | null;
  isCover: boolean;
  imageUrl: string;
  createdAt: string;
}

export interface AnimalListItem {
  id: string;
  commonName: string;
  scientificName: string;
  category: string;
  conservationStatus: string;
  biomes: string[];
  imageUrl: string | null;
}

export interface AnimalDetail extends AnimalListItem {
  coverImage: AnimalImage | null;
  images: AnimalImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnimalPayload {
  commonName: string;
  scientificName: string;
  categoryId: string;
  conservationStatusId: string;
  biomeIds: string[];
}

export type UpdateAnimalPayload = Partial<CreateAnimalPayload>;

export interface UploadAnimalImagePayload {
  file: File;
  altText?: string;
  isCover?: boolean;
}
