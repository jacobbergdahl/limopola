import { IMAGE_SIZE_DALL_E_2 } from "../../general/constants";
import { Button } from "../Button";

export type ImageSizeProps = {
  imageSize: IMAGE_SIZE_DALL_E_2;
  setImageSize: (imageSize: IMAGE_SIZE_DALL_E_2) => void;
};

export const ImageSizeDallE2 = ({
  imageSize,
  setImageSize,
}: ImageSizeProps) => {
  return (
    <>
      <h3>Image size</h3>
      <Button
        value={IMAGE_SIZE_DALL_E_2.Small}
        isSelected={imageSize === IMAGE_SIZE_DALL_E_2.Small}
        onClick={() => setImageSize(IMAGE_SIZE_DALL_E_2.Small)}
      />
      <Button
        value={IMAGE_SIZE_DALL_E_2.Medium}
        isSelected={imageSize === IMAGE_SIZE_DALL_E_2.Medium}
        onClick={() => setImageSize(IMAGE_SIZE_DALL_E_2.Medium)}
      />
      <Button
        value={IMAGE_SIZE_DALL_E_2.Large}
        isSelected={imageSize === IMAGE_SIZE_DALL_E_2.Large}
        onClick={() => setImageSize(IMAGE_SIZE_DALL_E_2.Large)}
      />
    </>
  );
};
