import Replicate from "replicate";
import {
  FLUX_MODE,
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import { NextApiResponse } from "next";
import { ProcessedBody } from "@/general/apiHelper";
import { extractErrorMessage } from "@/general/helpers";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const getFluxEndpoint = (model: MODEL) => {
  if (model === MODEL.Flux11ProUltra) {
    return "black-forest-labs/flux-1.1-pro-ultra";
  } else if (model === MODEL.Flux11Pro) {
    return "black-forest-labs/flux-1.1-pro";
  } else if (model === MODEL.FluxSchnell) {
    return "black-forest-labs/flux-schnell";
  }

  return "black-forest-labs/flux-schnell";
};

const getFluxInput = (
  model: MODEL,
  message: string,
  processedBody: ProcessedBody
) => {
  if (model === MODEL.Flux11ProUltra) {
    return {
      prompt: message,
      aspect_ratio: processedBody.aspectRatio,
      // 6 is the most permissive safety tolerance (2 is the default)
      safety_tolerance: 6,
      // raw mode generates less processed, more natural-looking images
      raw: processedBody.fluxMode === FLUX_MODE.Raw,
    };
  } else if (model === MODEL.Flux11Pro) {
    return {
      prompt: message,
      aspect_ratio: processedBody.aspectRatio,
      safety_tolerance: 6,
      output_quality: 100,
    };
  } else if (model === MODEL.FluxSchnell) {
    return {
      prompt: message,
      aspect_ratio: processedBody.aspectRatio,
      // schnell allows for generating 1 - 4 images at once
      num_outputs: processedBody.numberOfImages,
      // schnell will default to webp, unlike other Flux models which default to jpg
      output_format: "jpg",
      disable_safety_checker: true,
    };
  }

  return {
    prompt: message,
    aspect_ratio: processedBody.aspectRatio,
  };
};

export const flux = async (
  res: NextApiResponse,
  message: string,
  model: MODEL,
  processedBody: ProcessedBody
) => {
  console.log(`The backend is calling ${model} through Replicate.`);

  try {
    const completion = await replicate.run(getFluxEndpoint(model), {
      input: getFluxInput(model, message, processedBody),
    });

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
