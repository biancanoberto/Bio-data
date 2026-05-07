const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured.');
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase environment variables are not configured.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const imageDir = path.join(process.cwd(), 'prisma', 'seed-assets', 'animals');
const bucket = 'images-animals';

const animals = [
  {
    scientificName: 'Panthera onca',
    commonName: 'Onça-pintada',
    imageFileName: '1-onca.jpg',
  },
  {
    scientificName: 'Sapajus libidinosus',
    commonName: 'Macaco-prego',
    imageFileName: '2-macaco.jpg',
  },
  {
    scientificName: 'Podocnemis expansa',
    commonName: 'Tartaruga-da-amazônia',
    imageFileName: '3-tartaruga.jpg',
  },
  {
    scientificName: 'Anodorhynchus hyacinthinus',
    commonName: 'Arara-azul',
    imageFileName: '4-arara-azul.jpg',
  },
  {
    scientificName: 'Sylvilagus brasiliensis',
    commonName: 'Coelho-do-mato',
    imageFileName: '5-coelho.jpg',
  },
];

function resolveContentType(fileName) {
  if (fileName.endsWith('.png')) {
    return 'image/png';
  }
  if (fileName.endsWith('.webp')) {
    return 'image/webp';
  }
  return 'image/jpeg';
}

async function main() {
  for (const animalSeed of animals) {
    const animal = await prisma.animal.findFirst({
      where: {
        scientificName: animalSeed.scientificName,
      },
      select: {
        id: true,
      },
    });

    if (!animal) {
      throw new Error(`Animal not found for "${animalSeed.scientificName}".`);
    }

    const imagePath = path.join(imageDir, animalSeed.imageFileName);

    if (!fs.existsSync(imagePath)) {
      console.log(`Skipping ${animalSeed.commonName}: image file not found.`);
      continue;
    }

    const storagePath = `animals/${animal.id}/seed-${animalSeed.imageFileName}`;
    const fileBuffer = fs.readFileSync(imagePath);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        upsert: true,
        contentType: resolveContentType(animalSeed.imageFileName),
      });

    if (uploadError) {
      throw new Error(
        `Failed to upload image for "${animalSeed.commonName}": ${uploadError.message}`,
      );
    }

    const existing = await prisma.animalImage.findFirst({
      where: {
        animalId: animal.id,
        storageBucket: bucket,
        storagePath,
      },
      select: {
        id: true,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.animalImage.updateMany({
        where: {
          animalId: animal.id,
          isCover: true,
        },
        data: {
          isCover: false,
        },
      });

      if (existing) {
        await tx.animalImage.update({
          where: {
            id: existing.id,
          },
          data: {
            altText: animalSeed.commonName,
            isCover: true,
          },
        });
        return;
      }

      await tx.animalImage.create({
        data: {
          animalId: animal.id,
          storageBucket: bucket,
          storagePath,
          altText: animalSeed.commonName,
          isCover: true,
        },
      });
    });

    console.log(`Synced image for ${animalSeed.commonName}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
