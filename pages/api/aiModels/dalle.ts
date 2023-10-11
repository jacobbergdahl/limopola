import { STATUS_CODE } from "../../../general/constants";

export const dalle = async (
  res,
  openai,
  message,
  numberOfImages,
  imageSize
) => {
  console.log(
    `Asking Dall-E to generate ${numberOfImages} image(s) at a resolution of ${imageSize}`
  );
  const response = await openai.createImage({
    prompt: message,
    n: numberOfImages,
    size: imageSize,
  });
  const imageUrls = response.data.data.map((image) => image.url);
  res.status(STATUS_CODE.Ok).json({ result: imageUrls });
  return;
};
