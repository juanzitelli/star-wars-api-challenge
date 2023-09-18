-- CreateEnum
CREATE TYPE "SensitivityToTheForce" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "Planet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "climate" TEXT NOT NULL,
    "terrain" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "sensitivityToTheForce" "SensitivityToTheForce" NOT NULL,
    "current_location_id" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Starship" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "cargoCapacity" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "current_planet_id" INTEGER NOT NULL,
    "starshipId" INTEGER,

    CONSTRAINT "Starship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterToStarship" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToStarship_AB_unique" ON "_CharacterToStarship"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToStarship_B_index" ON "_CharacterToStarship"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_current_location_id_fkey" FOREIGN KEY ("current_location_id") REFERENCES "Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Starship" ADD CONSTRAINT "Starship_current_planet_id_fkey" FOREIGN KEY ("current_planet_id") REFERENCES "Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Starship" ADD CONSTRAINT "Starship_starshipId_fkey" FOREIGN KEY ("starshipId") REFERENCES "Starship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToStarship" ADD CONSTRAINT "_CharacterToStarship_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToStarship" ADD CONSTRAINT "_CharacterToStarship_B_fkey" FOREIGN KEY ("B") REFERENCES "Starship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
