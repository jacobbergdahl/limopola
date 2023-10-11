import type { NextApiRequest, NextApiResponse } from "next";
import { STATUS_CODE } from "../../../general/constants";

type MidjourneyData = {
  id: string;
  prompt: string;
  results?: string;
  user_created: string;
  date_created: string;
  status: string;
  progress?: string | null;
  url?: string;
  error?: string;
  upscaled_urls?: string[];
  upscaled?: string[];
};

/**
 * This is an unofficial Midjourney API implementation.
 * There is currently no official Midjourney API.
 */
export default async (res, message) => {
  if (!message || !process.env.MIDJOURNEY_API_KEY) {
    res
      .status(STATUS_CODE.BadRequest)
      .json({ result: "Bad Request: prompt and token are required" });
    return;
  }

  try {
    const createResponse = await fetch(
      "https://demo.imagineapi.dev/items/images/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MIDJOURNEY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      }
    );

    const createData: MidjourneyData = await createResponse.json();

    if (createData.status === "failed") {
      res
        .status(STATUS_CODE.BadRequest)
        .json({ result: "Image creation failed" });
      return;
    }

    const checkImage = async () => {
      const imageResponse = await fetch(
        `https://demo.imagineapi.dev/items/images/${createData.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.MIDJOURNEY_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const imageData: MidjourneyData = await imageResponse.json();

      // TODO: When wrapping up this implementation, make this the same format as DALL-E
      if (imageData.status === "completed") {
        res.status(STATUS_CODE.Ok).json({
          result:
            imageData.upscaled_urls ||
            imageData.url ||
            "Image generated but no URL found",
        });
        return;
      }

      if (imageData.status === "failed") {
        res
          .status(STATUS_CODE.BadRequest)
          .json({ result: "Image creation failed during generation" });
        return;
      }

      // Recursive setTimeout to recheck the status
      setTimeout(checkImage, 5000);
    };

    // Initiate the first check
    checkImage();
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(STATUS_CODE.InternalServerError)
      .json({ result: "Internal Server Error" });
  }
};
