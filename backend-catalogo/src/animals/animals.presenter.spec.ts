import { AnimalsPresenter } from './animals.presenter';

describe('AnimalsPresenter', () => {
  const resolveImageUrl = (bucket: string, path: string) =>
    `https://cdn.example.com/${bucket}/${path}`;

  it('maps animal list data to a frontend-ready shape', () => {
    const animal = {
      id: 'animal-1',
      commonName: 'Onça Pintada',
      scientificName: 'Panthera onca',
      category: { name: 'Mamífero' },
      conservationStatus: { name: 'Ameaçada' },
      biomes: [{ biome: { name: 'Pantanal' } }, { biome: { name: 'Amazônia' } }],
      images: [
        {
          id: 'image-1',
          storageBucket: 'images-animals',
          storagePath: 'animals/animal-1/cover.jpg',
          altText: 'Onça em perfil',
          isCover: true,
          createdAt: new Date('2026-05-03T12:00:00.000Z'),
        },
      ],
      createdAt: new Date('2026-05-03T12:00:00.000Z'),
      updatedAt: new Date('2026-05-03T12:00:00.000Z'),
    };

    expect(AnimalsPresenter.toListItem(animal, resolveImageUrl)).toEqual({
      id: 'animal-1',
      commonName: 'Onça Pintada',
      scientificName: 'Panthera onca',
      category: 'Mamífero',
      conservationStatus: 'Ameaçada',
      biomes: ['Pantanal', 'Amazônia'],
      imageUrl:
        'https://cdn.example.com/images-animals/animals/animal-1/cover.jpg',
    });
  });

  it('does not expose storage internals in the detail payload', () => {
    const animal = {
      id: 'animal-1',
      commonName: 'Onça Pintada',
      scientificName: 'Panthera onca',
      category: { name: 'Mamífero' },
      conservationStatus: { name: 'Ameaçada' },
      biomes: [{ biome: { name: 'Pantanal' } }],
      images: [
        {
          id: 'image-1',
          storageBucket: 'images-animals',
          storagePath: 'animals/animal-1/cover.jpg',
          altText: 'Onça em perfil',
          isCover: true,
          createdAt: new Date('2026-05-03T12:00:00.000Z'),
        },
      ],
      createdAt: new Date('2026-05-03T12:00:00.000Z'),
      updatedAt: new Date('2026-05-03T12:30:00.000Z'),
    };

    expect(AnimalsPresenter.toDetail(animal, resolveImageUrl)).toEqual({
      id: 'animal-1',
      commonName: 'Onça Pintada',
      scientificName: 'Panthera onca',
      category: 'Mamífero',
      conservationStatus: 'Ameaçada',
      biomes: ['Pantanal'],
      imageUrl:
        'https://cdn.example.com/images-animals/animals/animal-1/cover.jpg',
      coverImage: {
        id: 'image-1',
        altText: 'Onça em perfil',
        isCover: true,
        imageUrl:
          'https://cdn.example.com/images-animals/animals/animal-1/cover.jpg',
        createdAt: new Date('2026-05-03T12:00:00.000Z'),
      },
      images: [
        {
          id: 'image-1',
          altText: 'Onça em perfil',
          isCover: true,
          imageUrl:
            'https://cdn.example.com/images-animals/animals/animal-1/cover.jpg',
          createdAt: new Date('2026-05-03T12:00:00.000Z'),
        },
      ],
      createdAt: new Date('2026-05-03T12:00:00.000Z'),
      updatedAt: new Date('2026-05-03T12:30:00.000Z'),
    });
  });
});
