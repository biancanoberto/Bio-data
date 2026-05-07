CREATE UNIQUE INDEX "animal_images_one_cover_per_animal_idx"
ON "animal_images" ("animal_id")
WHERE "is_cover" = true;
