-- DropForeignKey
ALTER TABLE "Starship" DROP CONSTRAINT "Starship_current_planet_id_fkey";

-- AlterTable
ALTER TABLE "Starship" ALTER COLUMN "current_planet_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Starship" ADD CONSTRAINT "Starship_current_planet_id_fkey" FOREIGN KEY ("current_planet_id") REFERENCES "Planet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
