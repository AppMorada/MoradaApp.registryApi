-- CreateTable
CREATE TABLE "condominiums" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "CEP" CHAR(8) NOT NULL,
    "num" SMALLINT NOT NULL,
    "CNPJ" CHAR(14) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condominiums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "CPF" CHAR(11) NOT NULL,
    "block" CHAR(6),
    "apartment_number" SMALLINT,
    "phoneNumber" VARCHAR(30) NOT NULL,
    "level" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominiumId" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_name_key" ON "condominiums"("name");

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_CEP_key" ON "condominiums"("CEP");

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_CNPJ_key" ON "condominiums"("CNPJ");

-- CreateIndex
CREATE INDEX "users_level_name_idx" ON "users"("level", "name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_CPF_key" ON "users"("CPF");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
