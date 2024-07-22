import { LegacyRef, forwardRef } from "react";
import {
  FixedCropper,
  Priority,
  RectangleStencil,
  ImageRestriction,
  FixedCropperRef,
} from "react-advanced-cropper";

const Cropper = (
  { aspectRatio, src }: { aspectRatio: number; src: string },
  ref: LegacyRef<FixedCropperRef> | undefined
) => {
  const tensileProps = {
    aspectRatio: aspectRatio,
    handlers: false,
    lines: false,
    movable: false,
    resizable: false,
    className: "overlay transition-all ease-in-out shadow-md",
    lineClassName: "",
  };
  return (
    <FixedCropper
      ref={ref}
      backgroundWrapperClassName="w-full md:h-500"
      priority={Priority.visibleArea}
      stencilProps={tensileProps}
      stencilSize={{ width: 500, height: 500 }}
      src={src}
      className={"md:w-500 md:h-500 w-screen h-auto  cursor-move rounded-b-lg"}
      stencilComponent={RectangleStencil}
      imageRestriction={ImageRestriction.fillArea}
    />
  );
};

export default forwardRef(Cropper);
