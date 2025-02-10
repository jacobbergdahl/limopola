import Replicate from "replicate";
import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";
import { extractErrorMessage } from "@/general/helpers";
import { NextApiResponse } from "next";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const stableDiffusionSdXl = async (
  res: NextApiResponse,
  message: string,
  numberOfImages: number
) => {
  console.log(
    `The backend is calling stable-diffusion-xl-base-1.0 through Replicate.`
  );

  try {
    const completion = await replicate.run(
      "stability-ai/sdxl:d830ba5dabf8090ec0db6c10fc862c6eb1c929e1a194a5411852d25fd954ac82",
      {
        input: {
          prompt: message,
          num_outputs: numberOfImages,
        },
      }
    );

    if (SHOULD_SHOW_ALL_LOGS) {
      console.log("Response from Replicate:", completion);
    }

    res.status(STATUS_CODE.Ok).json({ result: completion });
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
