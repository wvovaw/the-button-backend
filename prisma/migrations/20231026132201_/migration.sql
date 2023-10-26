/*
  Warnings:

  - You are about to drop the column `highScore` on the `Record` table. All the data in the column will be lost.
  - Added the required column `highscore` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "highScore",
ADD COLUMN     "highscore" INTEGER NOT NULL;
