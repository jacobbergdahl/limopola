import { IMAGE_SIZE_DALL_E_3 } from "../../general/constants";
import { Button } from "../Button";

export type ImageSizeProps = {
  imageSize: IMAGE_SIZE_DALL_E_3;
  setImageSize: (imageSize: IMAGE_SIZE_DALL_E_3) => void;
};

export const ImageSizeDallE3 = ({
  imageSize,
  setImageSize,
}: ImageSizeProps) => {
  return (
    <>
      <h3>Image size</h3>
      <Button
        value={IMAGE_SIZE_DALL_E_3.One}
        isSelected={imageSize === IMAGE_SIZE_DALL_E_3.One}
        onClick={() => setImageSize(IMAGE_SIZE_DALL_E_3.One)}
      />
      <Button
        value={IMAGE_SIZE_DALL_E_3.Two}
        isSelected={imageSize === IMAGE_SIZE_DALL_E_3.Two}
        onClick={() => setImageSize(IMAGE_SIZE_DALL_E_3.Two)}
      />
      <Button
        value={IMAGE_SIZE_DALL_E_3.Three}
        isSelected={imageSize === IMAGE_SIZE_DALL_E_3.Three}
        onClick={() => setImageSize(IMAGE_SIZE_DALL_E_3.Three)}
      />
    </>
  );
};
