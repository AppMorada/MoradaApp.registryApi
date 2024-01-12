/*
  Warnings:

  - You are about to drop the column `apartment_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `block` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `condominiumId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_condominiumId_fkey";

-- DropIndex
DROP INDEX "users_level_name_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "apartment_number",
DROP COLUMN "block",
DROP COLUMN "condominiumId",
DROP COLUMN "level";

-- CreateTable
CREATE TABLE "invites" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "ttl" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "condominiumId" UUID NOT NULL,
    "type" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condominiumreluser" (
    "id" UUID NOT NULL,
    "block" VARCHAR(6),
    "apartment_number" INTEGER,
    "level" SMALLINT NOT NULL DEFAULT 0,
    "condominiumId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condominiumreluser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invites_email_condominiumId_key" ON "invites"("email", "condominiumId");

-- CreateIndex
CREATE UNIQUE INDEX "condominiumreluser_userId_condominiumId_key" ON "condominiumreluser"("userId", "condominiumId");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominiumreluser" ADD CONSTRAINT "condominiumreluser_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominiumreluser" ADD CONSTRAINT "condominiumreluser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
