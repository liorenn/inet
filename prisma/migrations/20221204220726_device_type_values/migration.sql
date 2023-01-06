/*
  Warnings:

  - Changed the type of `deviceTypeValue` on the `Mac` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deviceTypeValue` on the `TouchDevice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DeviceTypeFamily" AS ENUM ('airpods', 'mac', 'touchDevice');

-- CreateEnum
CREATE TYPE "MacType" AS ENUM ('macbook', 'iMac');

-- CreateEnum
CREATE TYPE "TouchDeviceType" AS ENUM ('appleWatch', 'iPad', 'iPhone');

-- AlterTable
ALTER TABLE "Mac" DROP COLUMN "deviceTypeValue",
ADD COLUMN     "deviceTypeValue" "MacType" NOT NULL;

-- AlterTable
ALTER TABLE "TouchDevice" DROP COLUMN "deviceTypeValue",
ADD COLUMN     "deviceTypeValue" "TouchDeviceType" NOT NULL;
