-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "AirpodsFeature" AS ENUM ('spatial_audio', 'active_noise_cancellation', 'transparency_mode');

-- CreateEnum
CREATE TYPE "BiometricFeature" AS ENUM ('face_id', 'touch_id', 'passcode');

-- CreateEnum
CREATE TYPE "CameraType" AS ENUM ('ultrawind', 'wide', 'telephoto', 'front');

-- CreateEnum
CREATE TYPE "DeviceConnector" AS ENUM ('lightning', 'usb_c', 'thunderbolt_3', 'magsafe');

-- CreateEnum
CREATE TYPE "DeviceTypeValue" AS ENUM ('airpods', 'ipad', 'iphone', 'applewatch', 'mac', 'imac', 'macbook');

-- CreateEnum
CREATE TYPE "ResistanceFeature" AS ENUM ('water', 'splash', 'dust', 'sweat');

-- CreateEnum
CREATE TYPE "ScreenType" AS ENUM ('oled', 'lcd');

-- CreateTable
CREATE TABLE "Airpods" (
    "model" VARCHAR NOT NULL,
    "case" VARCHAR NOT NULL,
    "features" "AirpodsFeature"[],

    CONSTRAINT "Airpods_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "AppleWatch" (
    "model" VARCHAR NOT NULL,

    CONSTRAINT "AppleWatch_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "Camera" (
    "id" SERIAL NOT NULL,
    "deviceTypeValue" "DeviceTypeValue" NOT NULL,
    "megapixel" SMALLINT NOT NULL,
    "model" TEXT,
    "cameraType" "CameraType" NOT NULL,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "name" TEXT NOT NULL,
    "hex" VARCHAR NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL,
    "username" VARCHAR,
    "deviceTypeValue" "DeviceTypeValue" NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "model" TEXT NOT NULL,
    "deviceTypeValue" "DeviceTypeValue" NOT NULL,
    "name" VARCHAR NOT NULL,
    "releaseDate" DATE NOT NULL,
    "batterySize" INTEGER NOT NULL,
    "chipset" VARCHAR NOT NULL,
    "operatingSystem" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "imageAmount" SMALLINT NOT NULL,
    "biometrics" "BiometricFeature" NOT NULL,
    "resistanceRating" VARCHAR NOT NULL,
    "resistance" "ResistanceFeature"[],
    "releasePrice" SMALLINT NOT NULL,
    "connectors" "DeviceConnector"[],

    CONSTRAINT "Device_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "DeviceUser" (
    "deviceModel" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,

    CONSTRAINT "DeviceUser_pkey" PRIMARY KEY ("deviceModel","userId")
);

-- CreateTable
CREATE TABLE "DeviceColor" (
    "colorName" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "deviceTypeValue" "DeviceTypeValue" NOT NULL,

    CONSTRAINT "DeviceColor_pkey" PRIMARY KEY ("colorName","model")
);

-- CreateTable
CREATE TABLE "DeviceType" (
    "model" TEXT NOT NULL,
    "deviceTypeValue" "DeviceTypeValue" NOT NULL,

    CONSTRAINT "DeviceType_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "Mac" (
    "model" VARCHAR NOT NULL,
    "cpu" SMALLINT NOT NULL,
    "gpu" SMALLINT NOT NULL,
    "unifiedMemory" SMALLINT NOT NULL,
    "storage" SMALLINT NOT NULL,
    "chipset" VARCHAR NOT NULL,
    "deviceTypeValue" "DeviceTypeValue" NOT NULL,

    CONSTRAINT "Mac_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "Macbook" (
    "model" VARCHAR NOT NULL,
    "screenSize" REAL NOT NULL,
    "batterySize" INTEGER NOT NULL,
    "wiredCharging" INTEGER NOT NULL,

    CONSTRAINT "Macbook_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "TouchDevice" (
    "model" VARCHAR NOT NULL,
    "screenSize" REAL NOT NULL,
    "screenType" "ScreenType" NOT NULL,
    "wiredCharging" REAL NOT NULL,
    "wirelessCharging" REAL NOT NULL,
    "memory" SMALLINT NOT NULL,
    "storage" SMALLINT NOT NULL,
    "deviceTypeValue" "DeviceTypeValue" NOT NULL,

    CONSTRAINT "TouchDevice_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "iMac" (
    "model" VARCHAR NOT NULL,
    "screenSize" REAL NOT NULL,

    CONSTRAINT "iMac_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "iPad" (
    "model" VARCHAR NOT NULL,

    CONSTRAINT "iPad_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "iPhone" (
    "model" VARCHAR NOT NULL,

    CONSTRAINT "iPhone_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airpods_model_key" ON "Airpods"("model");

-- CreateIndex
CREATE UNIQUE INDEX "AppleWatch_model_key" ON "AppleWatch"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Camera_id_key" ON "Camera"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_model_key" ON "DeviceType"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Mac_model_key" ON "Mac"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Macbook_model_key" ON "Macbook"("model");

-- CreateIndex
CREATE UNIQUE INDEX "TouchDevice_model_key" ON "TouchDevice"("model");

-- CreateIndex
CREATE UNIQUE INDEX "iMac_model_key" ON "iMac"("model");

-- CreateIndex
CREATE UNIQUE INDEX "iPad_model_key" ON "iPad"("model");

-- CreateIndex
CREATE UNIQUE INDEX "iPhone_model_key" ON "iPhone"("model");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Airpods" ADD CONSTRAINT "Airpods_model_fkey" FOREIGN KEY ("model") REFERENCES "DeviceType"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppleWatch" ADD CONSTRAINT "AppleWatch_model_fkey" FOREIGN KEY ("model") REFERENCES "TouchDevice"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_model_fkey" FOREIGN KEY ("model") REFERENCES "Device"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_model_fkey" FOREIGN KEY ("model") REFERENCES "Device"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceUser" ADD CONSTRAINT "DeviceUser_deviceModel_fkey" FOREIGN KEY ("deviceModel") REFERENCES "Device"("model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceUser" ADD CONSTRAINT "DeviceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceColor" ADD CONSTRAINT "DeviceColor_colorName_fkey" FOREIGN KEY ("colorName") REFERENCES "Color"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceColor" ADD CONSTRAINT "DeviceColor_model_fkey" FOREIGN KEY ("model") REFERENCES "Device"("model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceType" ADD CONSTRAINT "DeviceType_model_fkey" FOREIGN KEY ("model") REFERENCES "Device"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mac" ADD CONSTRAINT "Mac_model_fkey" FOREIGN KEY ("model") REFERENCES "DeviceType"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Macbook" ADD CONSTRAINT "Macbook_model_fkey" FOREIGN KEY ("model") REFERENCES "Mac"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TouchDevice" ADD CONSTRAINT "TouchDevice_model_fkey" FOREIGN KEY ("model") REFERENCES "DeviceType"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iMac" ADD CONSTRAINT "iMac_model_fkey" FOREIGN KEY ("model") REFERENCES "Mac"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iPad" ADD CONSTRAINT "iPad_model_fkey" FOREIGN KEY ("model") REFERENCES "TouchDevice"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iPhone" ADD CONSTRAINT "iPhone_model_fkey" FOREIGN KEY ("model") REFERENCES "TouchDevice"("model") ON DELETE CASCADE ON UPDATE CASCADE;
