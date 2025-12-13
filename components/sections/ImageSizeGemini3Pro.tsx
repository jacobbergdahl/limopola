import { IMAGE_SIZE_GEMINI_3_PRO } from "../../general/constants";
import { Button } from "../Button";

export type ImageSizeProps = {
  imageSize: IMAGE_SIZE_GEMINI_3_PRO;
  setImageSize: (imageSize: IMAGE_SIZE_GEMINI_3_PRO) => void;
};

export const ImageSizeGemini3Pro = ({
  imageSize,
  setImageSize,
}: ImageSizeProps) => {
  return (
    <>
      <h3>Image size</h3>
      <Button
        value={IMAGE_SIZE_GEMINI_3_PRO.One}
        isSelected={imageSize === IMAGE_SIZE_GEMINI_3_PRO.One}
        onClick={() => setImageSize(IMAGE_SIZE_GEMINI_3_PRO.One)}
      />
      <Button
        value={IMAGE_SIZE_GEMINI_3_PRO.Two}
        isSelected={imageSize === IMAGE_SIZE_GEMINI_3_PRO.Two}
        onClick={() => setImageSize(IMAGE_SIZE_GEMINI_3_PRO.Two)}
      />
      <Button
        value={IMAGE_SIZE_GEMINI_3_PRO.Three}
        isSelected={imageSize === IMAGE_SIZE_GEMINI_3_PRO.Three}
        onClick={() => setImageSize(IMAGE_SIZE_GEMINI_3_PRO.Three)}
      />
    </>
  );
};
