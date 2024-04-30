/*
  Warnings:

  - The values [geografia,anatomia,matematicas,arte,literatura,fisica,biologia,historia,quimica,musica,economia,filosofia,derecho,idiomas,informatica,geologia,psicologia,contabilidad,astronomia,hosteleria,sociologia,sexologia,ingenieria,arquitectura,paleontologia] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('geography', 'anatomy', 'mathematics', 'art', 'literature', 'physics', 'biology', 'history', 'chemistry', 'music', 'economics', 'philosophy', 'law', 'languages', 'computerScience', 'geology', 'psychology', 'accounting', 'astronomy', 'hospitality', 'sociology', 'sexology', 'engineering', 'architecture', 'paleontology');
ALTER TABLE "Project" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;
