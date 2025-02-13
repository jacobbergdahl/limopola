import Replicate from "replicate";
import {
  FLUX_MODE,
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
} from "../../../general/constants";
import { NextApiResponse } from "next";
import { ProcessedBody } from "@/general/apiHelper";
import { extractErrorMessage, getRandomString } from "@/general/helpers";
import { writeFile, mkdir } from "node:fs/promises";

// This is a NextJS convention. These two paths point to the same place in the end.
// Since these static files are served on the frontend, they need to be in the public directory.
const IMAGES_SAVED_IN_DIRECTORY = "public/ai-images";
const IMAGES_ACCESSED_THROUGH_DIRECTORY = "ai-images";

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
    const output = await replicate.run(getFluxEndpoint(model), {
      input: getFluxInput(model, message, processedBody),
    });

    if (SHOULD_SHOW_ALL_LOGS) {
      console.log("Response from Replicate:", output);
    }

    const fileName = message
      .toLowerCase()
      // Replaces any character that's not a character or number with a dash
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 20)
      // Removes dashes at the very start and end
      .replace(/^-+|-+$/g, "");

    // Creates the images directory if it doesn't already exist
    await mkdir(IMAGES_SAVED_IN_DIRECTORY, { recursive: true });

    const outputs = Array.isArray(output) ? output : [output];
    const filePaths = await Promise.all(
      outputs.map(async (image) => {
        // The filename needs a random suffix to avoid overwriting past images.
        // This could also be solved by checking it a file with this fileName already exists,
        // but this is more efficient. Using the index wouldn't work in case the image(s)
        // were created in a different API call as users re-use prompts.
        const finalFilenameWithFileExtension = `${fileName}-${getRandomString()}.jpg`;

        await writeFile(
          `${IMAGES_SAVED_IN_DIRECTORY}/${finalFilenameWithFileExtension}`,
          image
        );
        return `${IMAGES_ACCESSED_THROUGH_DIRECTORY}/${finalFilenameWithFileExtension}`;
      })
    );

    res
      .status(STATUS_CODE.Ok)
      .json({ result: filePaths.length > 1 ? filePaths : filePaths[0] });
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error(error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ error: { message: errorMessage } });
  }
};
