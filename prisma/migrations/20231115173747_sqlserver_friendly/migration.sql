-- CreateTable
CREATE TABLE "Camera" (
    "type" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "megapixel" SMALLINT NOT NULL,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("model","type")
);

-- CreateTable
CREATE TABLE "Color" (
    "name" TEXT NOT NULL,
    "hex" VARCHAR NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "accessKey" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL,
    "username" VARCHAR NOT NULL,
    "Rating" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "DeviceColor_pkey" PRIMARY KEY ("colorName","model")
);

-- CreateTable
CREATE TABLE "Device" (
    "model" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "releaseDate" DATE NOT NULL,
    "releaseOS" VARCHAR,
    "releasePrice" SMALLINT NOT NULL,
    "connector" VARCHAR NOT NULL,
    "biometrics" VARCHAR NOT NULL,
    "batterySize" SMALLINT NOT NULL,
    "chipset" VARCHAR NOT NULL,
    "weight" REAL NOT NULL,
    "description" VARCHAR NOT NULL,
    "imageAmount" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "width" SMALLINT NOT NULL,
    "depth" SMALLINT NOT NULL,
    "storage" SMALLINT,
    "cpu" SMALLINT,
    "gpu" SMALLINT,
    "memory" SMALLINT,
    "wiredCharging" REAL,
    "magsafe" BOOLEAN NOT NULL,
    "wirelessCharging" REAL,
    "screenSize" REAL,
    "screenType" VARCHAR,
    "resistanceRating" VARCHAR,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "DeviceConnector" (
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceConnector_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "BiometricFeature" (
    "name" TEXT NOT NULL,

    CONSTRAINT "BiometricFeature_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "CameraType" (
    "name" TEXT NOT NULL,

    CONSTRAINT "CameraType_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "DeviceType" (
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceType_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceConnector_name_key" ON "DeviceConnector"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BiometricFeature_name_key" ON "BiometricFeature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CameraType_name_key" ON "CameraType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_name_key" ON "DeviceType"("name");

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_model_fkey" FOREIGN KEY ("model") REFERENCES "Device"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_type_fkey" FOREIGN KEY ("type") REFERENCES "CameraType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_model_fkey" FOREIGN KEY ("model") REFERENCES "Device"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceUser" ADD CONSTRAINT "DeviceUser_deviceModel_fkey" FOREIGN KEY ("deviceModel") REFERENCES "Device"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceUser" ADD CONSTRAINT "DeviceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceColor" ADD CONSTRAINT "DeviceColor_colorName_fkey" FOREIGN KEY ("colorName") REFERENCES "Color"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceColor" ADD CONSTRAINT "DeviceColor_model_fkey" FOREIGN KEY ("model") REFERENCES "Device"("model") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_biometrics_fkey" FOREIGN KEY ("biometrics") REFERENCES "BiometricFeature"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_connector_fkey" FOREIGN KEY ("connector") REFERENCES "DeviceConnector"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_type_fkey" FOREIGN KEY ("type") REFERENCES "DeviceType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
