import { IMAGE_SIZE } from "../../general/constants";
import { Button } from "../Button";

export type ImageSizeProps = {
  imageSize: IMAGE_SIZE;
  setImageSize: (imageSize: IMAGE_SIZE) => void;
};

export const ImageSize = ({ imageSize, setImageSize }: ImageSizeProps) => {
  return (
    <>
      <h3>Image size</h3>
      <Button
        value={IMAGE_SIZE.Small}
        isSelected={imageSize === IMAGE_SIZE.Small}
        onClick={() => setImageSize(IMAGE_SIZE.Small)}
      />
      <Button
        value={IMAGE_SIZE.Medium}
        isSelected={imageSize === IMAGE_SIZE.Medium}
        onClick={() => setImageSize(IMAGE_SIZE.Medium)}
      />
      <Button
        value={IMAGE_SIZE.Large}
        isSelected={imageSize === IMAGE_SIZE.Large}
        onClick={() => setImageSize(IMAGE_SIZE.Large)}
      />
    </>
  );
};
