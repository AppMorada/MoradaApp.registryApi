-- CreateTable
CREATE TABLE "condominiums" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "CEP" CHAR(8) NOT NULL,
    "num" INTEGER NOT NULL,
    "CNPJ" CHAR(14) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condominiums_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "CPF" CHAR(11) NOT NULL,
    "phoneNumber" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_name_key" ON "condominiums"("name");

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_CEP_key" ON "condominiums"("CEP");

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_CNPJ_key" ON "condominiums"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "invites_email_condominiumId_key" ON "invites"("email", "condominiumId");

-- CreateIndex
CREATE UNIQUE INDEX "condominiumreluser_userId_condominiumId_key" ON "condominiumreluser"("userId", "condominiumId");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_CPF_key" ON "users"("CPF");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominiumreluser" ADD CONSTRAINT "condominiumreluser_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominiumreluser" ADD CONSTRAINT "condominiumreluser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
