type AnimalImageView = {
  id: string;
  storageBucket: string;
  storagePath: string;
  altText: string | null;
  isCover: boolean;
  createdAt: Date;
};

type AnimalBiomeView = {
  biome: {
    name: string;
  };
};

type AnimalView = {
  id: string;
  commonName: string;
  scientificName: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
  };
  conservationStatus: {
    name: string;
  };
  biomes: AnimalBiomeView[];
  images: AnimalImageView[];
};

type ResolveImageUrl = (bucket: string, path: string) => string;

export class AnimalsPresenter {
  static toListItem(animal: AnimalView, resolveImageUrl: ResolveImageUrl) {
    const coverImage = this.pickCoverImage(animal.images);

    return {
      id: animal.id,
      commonName: animal.commonName,
      scientificName: animal.scientificName,
      category: animal.category.name,
      conservationStatus: animal.conservationStatus.name,
      biomes: animal.biomes.map(({ biome }) => biome.name),
      imageUrl: coverImage
        ? resolveImageUrl(coverImage.storageBucket, coverImage.storagePath)
        : null,
    };
  }

  static toDetail(animal: AnimalView, resolveImageUrl: ResolveImageUrl) {
    const coverImage = this.pickCoverImage(animal.images);

    return {
      id: animal.id,
      commonName: animal.commonName,
      scientificName: animal.scientificName,
      category: animal.category.name,
      conservationStatus: animal.conservationStatus.name,
      biomes: animal.biomes.map(({ biome }) => biome.name),
      imageUrl: coverImage
        ? resolveImageUrl(coverImage.storageBucket, coverImage.storagePath)
        : null,
      coverImage: coverImage
        ? this.toImage(coverImage, resolveImageUrl)
        : null,
      images: animal.images.map((image) => this.toImage(image, resolveImageUrl)),
      createdAt: animal.createdAt,
      updatedAt: animal.updatedAt,
    };
  }

  static toImage(image: AnimalImageView, resolveImageUrl: ResolveImageUrl) {
    return {
      id: image.id,
      altText: image.altText,
      isCover: image.isCover,
      imageUrl: resolveImageUrl(image.storageBucket, image.storagePath),
      createdAt: image.createdAt,
    };
  }

  private static pickCoverImage(images: AnimalImageView[]) {
    return images.find((image) => image.isCover) ?? images[0] ?? null;
  }
}
