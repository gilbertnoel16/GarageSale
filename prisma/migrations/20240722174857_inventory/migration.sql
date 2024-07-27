-- CreateTable
CREATE TABLE "Donator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Donator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" MONEY NOT NULL,
    "donatorId" INTEGER,
    "stock" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donator_name_key" ON "Donator"("name");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_donatorId_fkey" FOREIGN KEY ("donatorId") REFERENCES "Donator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
