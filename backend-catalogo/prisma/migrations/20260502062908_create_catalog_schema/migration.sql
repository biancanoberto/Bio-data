-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conservation_statuses" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "level" INTEGER NOT NULL,
    "color" VARCHAR(30),

    CONSTRAINT "conservation_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biomes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "biomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" UUID NOT NULL,
    "common_name" VARCHAR(120) NOT NULL,
    "scientific_name" VARCHAR(160) NOT NULL,
    "category_id" UUID NOT NULL,
    "conservation_status_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_biomes" (
    "animal_id" UUID NOT NULL,
    "biome_id" UUID NOT NULL,

    CONSTRAINT "animal_biomes_pkey" PRIMARY KEY ("animal_id","biome_id")
);

-- CreateTable
CREATE TABLE "animal_images" (
    "id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "storage_bucket" VARCHAR(80) NOT NULL,
    "storage_path" TEXT NOT NULL,
    "alt_text" VARCHAR(255),
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animal_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "conservation_statuses_name_key" ON "conservation_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "biomes_name_key" ON "biomes"("name");

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_conservation_status_id_fkey" FOREIGN KEY ("conservation_status_id") REFERENCES "conservation_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_biomes" ADD CONSTRAINT "animal_biomes_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_biomes" ADD CONSTRAINT "animal_biomes_biome_id_fkey" FOREIGN KEY ("biome_id") REFERENCES "biomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_images" ADD CONSTRAINT "animal_images_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
