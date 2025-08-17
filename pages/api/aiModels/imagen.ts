import Replicate from "replicate";
import { MODEL, STATUS_CODE } from "../../../general/constants";
import { NextApiResponse } from "next";
import { ProcessedBody } from "@/general/apiHelper";
import { extractErrorMessage } from "@/general/helpers";
import { saveMedia } from "../saveMedia";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const imagen = async (
  res: NextApiResponse,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling google/${model} through Replicate.`);

  try {
    const input = {
      prompt: `The photo: ${message}`,
      aspect_ratio: processedBody.aspectRatio,
    };

    const output = await replicate.run(
      ("google/" + model) as `${string}/${string}`,
      {
        input,
      }
    );

    const imageSavedAtFilePaths = await saveMedia(message, output);

    res.status(STATUS_CODE.Ok).json({
      result:
        imageSavedAtFilePaths.length > 1
          ? imageSavedAtFilePaths
          : imageSavedAtFilePaths[0],
    });
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
