import { cameraTypesNames, enumValuesType } from '~/data/enums'

import { ColorName } from '~/data/colors'

type enumQuery = {
  connect: { name: enumValuesType }
}

export function createEnumObject(value: enumValuesType): enumQuery {
  return {
    connect: { name: value }
  }
}

type camera = {
  megaPixel: number
  cameraType: cameraTypesNames
}

export type cameraQuery = {
  create: {
    megapixel: number
    cameraType: {
      connect: {
        name: cameraTypesNames
      }
    }
  }[]
}

export function createCamerasObject(arr: camera[]): cameraQuery {
  const cameras = arr.map((camera) => ({
    megapixel: camera.megaPixel,
    cameraType: { connect: { name: camera.cameraType } }
  }))

  return {
    create: cameras
  }
}

export type colorQuery = {
  createMany: {
    data: {
      colorName: ColorName
    }[]
  }
}

export function createColorsObjects(arr: ColorName[]): colorQuery {
  const array = arr.map((color) => {
    return {
      colorName: color
    }
  })
  return {
    createMany: {
      data: array
    }
  }
}
