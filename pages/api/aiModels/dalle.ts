import {
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";

export const dalle = async (
  res,
  openai,
  message,
  numberOfImages,
  imageSize,
  model: MODEL
) => {
  console.log(
    `Asking Dall-E model ${model} to generate ${numberOfImages} image(s) at a resolution of ${imageSize}`
  );
  try {
    const response =
      model === MODEL.Dalle3
        ? await openai.createImage({
            model: MODEL.Dalle3,
            prompt: message,
            n: 1, // DALL-E 3 only supports making one image at a time
            quality: "hd", // We might want to let users set this manually in the future
            size: imageSize,
          })
        : await openai.createImage({
            prompt: message,
            n: numberOfImages,
            size: imageSize,
          });

    const imageUrls = response.data.data.map((image) => image.url);
    if (SHOULD_SHOW_ALL_LOGS && imageUrls.length > 0) {
      console.log("Dall-E created the image(s) at the following url(s)\n");
      imageUrls.forEach((imageUrl) => console.log(imageUrl));
      console.log("");
    }
    res.status(STATUS_CODE.Ok).json({ result: imageUrls });
    return;
  } catch (error) {
    console.error(error);
    let errorMessage = error?.message;
    if (error?.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    }
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
    return;
  }
};
