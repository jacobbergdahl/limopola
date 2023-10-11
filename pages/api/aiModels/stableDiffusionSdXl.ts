import Replicate from "replicate";
import { SHOULD_SHOW_ALL_LOGS, STATUS_CODE } from "../../../general/constants";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const stableDiffusionSdXl = async (res, message, numberOfImages) => {
  console.log(
    `The backend is calling stable-diffusion-xl-base-1.0 through Replicate.`
  );

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
  return;
};
