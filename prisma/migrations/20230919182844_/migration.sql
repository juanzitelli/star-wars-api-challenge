/*
  Warnings:

  - You are about to drop the `_CharacterToStarship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CharacterToStarship" DROP CONSTRAINT "_CharacterToStarship_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterToStarship" DROP CONSTRAINT "_CharacterToStarship_B_fkey";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "starshipId" INTEGER;

-- DropTable
DROP TABLE "_CharacterToStarship";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_starshipId_fkey" FOREIGN KEY ("starshipId") REFERENCES "Starship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
