import { LegacyRef, forwardRef } from 'react'
import {
  Cropper as MCropper,
  Priority,
  RectangleStencil,
  ImageRestriction,
  CropperRef,
} from 'react-advanced-cropper'
import {
  zoomStencil,
  fitStencilToImage,
  resizeCoordinates,
  transformImage,
  defaultSize,
  stencilConstraints,
} from 'advanced-cropper/showcase/mobile'

const Cropper = (
  { aspectRatio, src }: { aspectRatio: number; src: string },
  ref: LegacyRef<CropperRef> | undefined
) => {
  const tensileProps = {
    aspectRatio: aspectRatio,
    handlers: false,
    lines: false,
    movable: false,
    resizable: true,
    className: 'overlay transition-all ease-in-out shadow-md',
  }

  return (
    <MCropper
      ref={ref}
      stencilConstraints={stencilConstraints}
      priority={Priority.visibleArea}
      stencilProps={tensileProps}
      src={src}
      postProcess={[fitStencilToImage, zoomStencil]}
      className={'sm:h-500 sm:w-500 w-screen aspect-1 cursor-move rounded-b-lg'}
      stencilComponent={RectangleStencil}
      imageRestriction={ImageRestriction.none}
      transformImageAlgorithm={transformImage}
      transitions={true}
      defaultSize={defaultSize}
      resizeCoordinates={resizeCoordinates}
    />
  )
}

export default forwardRef(Cropper)
