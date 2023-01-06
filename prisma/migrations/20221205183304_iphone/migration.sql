/*
  Warnings:

  - The values [mac] on the enum `DeviceTypeValue` will be removed. If these variants are still used in the database, this will fail.
  - The values [iMac] on the enum `MacType` will be removed. If these variants are still used in the database, this will fail.
  - The values [iPad,iPhone] on the enum `TouchDeviceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deviceTypeValue` on the `DeviceType` table. All the data in the column will be lost.
  - You are about to drop the column `deviceTypeValue` on the `Mac` table. All the data in the column will be lost.
  - You are about to drop the column `deviceTypeValue` on the `TouchDevice` table. All the data in the column will be lost.
  - You are about to drop the `iMac` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iPad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `iPhone` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deviceTypeFamily` to the `DeviceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `macType` to the `Mac` table without a default value. This is not possible if the table is not empty.
  - Added the required column `touchDeviceType` to the `TouchDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeviceTypeValue_new" AS ENUM ('airpods', 'ipad', 'iphone', 'applewatch', 'imac', 'macbook');
ALTER TABLE "Camera" ALTER COLUMN "deviceTypeValue" TYPE "DeviceTypeValue_new" USING ("deviceTypeValue"::text::"DeviceTypeValue_new");
ALTER TABLE "Comment" ALTER COLUMN "deviceTypeValue" TYPE "DeviceTypeValue_new" USING ("deviceTypeValue"::text::"DeviceTypeValue_new");
ALTER TABLE "Device" ALTER COLUMN "deviceTypeValue" TYPE "DeviceTypeValue_new" USING ("deviceTypeValue"::text::"DeviceTypeValue_new");
ALTER TABLE "DeviceColor" ALTER COLUMN "deviceTypeValue" TYPE "DeviceTypeValue_new" USING ("deviceTypeValue"::text::"DeviceTypeValue_new");
ALTER TYPE "DeviceTypeValue" RENAME TO "DeviceTypeValue_old";
ALTER TYPE "DeviceTypeValue_new" RENAME TO "DeviceTypeValue";
DROP TYPE "DeviceTypeValue_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MacType_new" AS ENUM ('macbook', 'imac');
ALTER TABLE "Mac" ALTER COLUMN "macType" TYPE "MacType_new" USING ("macType"::text::"MacType_new");
ALTER TYPE "MacType" RENAME TO "MacType_old";
ALTER TYPE "MacType_new" RENAME TO "MacType";
DROP TYPE "MacType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TouchDeviceType_new" AS ENUM ('appleWatch', 'ipad', 'iphone');
ALTER TABLE "TouchDevice" ALTER COLUMN "touchDeviceType" TYPE "TouchDeviceType_new" USING ("touchDeviceType"::text::"TouchDeviceType_new");
ALTER TYPE "TouchDeviceType" RENAME TO "TouchDeviceType_old";
ALTER TYPE "TouchDeviceType_new" RENAME TO "TouchDeviceType";
DROP TYPE "TouchDeviceType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "iMac" DROP CONSTRAINT "iMac_model_fkey";

-- DropForeignKey
ALTER TABLE "iPad" DROP CONSTRAINT "iPad_model_fkey";

-- DropForeignKey
ALTER TABLE "iPhone" DROP CONSTRAINT "iPhone_model_fkey";

-- AlterTable
ALTER TABLE "DeviceType" DROP COLUMN "deviceTypeValue",
ADD COLUMN     "deviceTypeFamily" "DeviceTypeFamily" NOT NULL;

-- AlterTable
ALTER TABLE "Mac" DROP COLUMN "deviceTypeValue",
ADD COLUMN     "macType" "MacType" NOT NULL;

-- AlterTable
ALTER TABLE "TouchDevice" DROP COLUMN "deviceTypeValue",
ADD COLUMN     "touchDeviceType" "TouchDeviceType" NOT NULL;

-- DropTable
DROP TABLE "iMac";

-- DropTable
DROP TABLE "iPad";

-- DropTable
DROP TABLE "iPhone";

-- CreateTable
CREATE TABLE "Imac" (
    "model" VARCHAR NOT NULL,
    "screenSize" REAL NOT NULL,

    CONSTRAINT "Imac_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "Ipad" (
    "model" VARCHAR NOT NULL,

    CONSTRAINT "Ipad_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "Iphone" (
    "model" VARCHAR NOT NULL,

    CONSTRAINT "Iphone_pkey" PRIMARY KEY ("model")
);

-- CreateIndex
CREATE UNIQUE INDEX "Imac_model_key" ON "Imac"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Ipad_model_key" ON "Ipad"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Iphone_model_key" ON "Iphone"("model");

-- AddForeignKey
ALTER TABLE "Imac" ADD CONSTRAINT "Imac_model_fkey" FOREIGN KEY ("model") REFERENCES "Mac"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ipad" ADD CONSTRAINT "Ipad_model_fkey" FOREIGN KEY ("model") REFERENCES "TouchDevice"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iphone" ADD CONSTRAINT "Iphone_model_fkey" FOREIGN KEY ("model") REFERENCES "TouchDevice"("model") ON DELETE CASCADE ON UPDATE CASCADE;
