import { Configuration, OpenAIApi } from "openai";
import {
  ALL_LLAMA_MODELS,
  DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
  DEFAULT_TECHNICAL_VOICE_STABILITY,
  IMAGE_SIZE,
  MODEL,
  STATUS_CODE,
} from "../../general/constants";
import { dalle } from "./aiModels/dalle";
import { debug } from "./aiModels/debug";
import { gpt } from "./aiModels/gpt";
import { stableDiffusionSdXl } from "./aiModels/stableDiffusionSdXl";
import { llama2 } from "./aiModels/llama";
import { textToPokemon } from "./aiModels/textToPokemon";
import { animateDiff } from "./aiModels/animateDiff";
import { llamaLocal } from "./aiModels/llamaLocal";
import { elevenLabs } from "./aiModels/elevenLabs";
import { factChecker } from "./aiModels/factChecker";
import midjourney from "./aiModels/midjourney";
import { NextApiRequest, NextApiResponse } from "next";

export type ProcessedBody = {
  numberOfImages: number;
  imageSize: string;
  requestedNumberOfTokens: number;
  voiceSimilarityBoost: number;
  voiceStability: number;
  temperature: number | undefined;
  frequencyPenalty: number | undefined;
  frequency_penalty: number | undefined;
  presencePenalty: number | undefined;
  topP: number | undefined;
  maxNumberOfTokens: number | undefined;
};

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const message = req.body.message || "";
  const model = req.body.model || "";
  const numberOfImages = req.body.numberOfImages || 1;
  const imageSize = req.body.imageSize || IMAGE_SIZE.Small;
  const temperature = req.body.temperature;
  const requestedNumberOfTokens = req.body.requestedNumberOfTokens || 100;
  const maxNumberOfTokens =
    req.body.maxNumberOfTokens && req.body.maxNumberOfTokens > 0
      ? req.body.maxNumberOfTokens
      : undefined;
  const voiceSimilarityBoost =
    req.body.voiceSimilarityBoost || DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST;
  const voiceStability =
    req.body.voiceStability || DEFAULT_TECHNICAL_VOICE_STABILITY;
  const frequencyPenalty = req.body.frequencyPenalty;
  const presencePenalty = req.body.presencePenalty;
  const topP = req.body.topP;
  const isUsingDefaultTemperature = req.body.isTemperatureDefault;
  const isUsingDefaultTopP = req.body.isTopPDefault;
  const isUsingDefaultFrequencyPenalty = req.body.isFrequencyPenaltyDefault;
  const isUsingDefaultPresencePenalty = req.body.isPresencePenaltyDefault;

  // The idea is to use this in all API calls later. Right now, there are a lot of inconsistencies in the code.
  const processedBody: ProcessedBody = {
    numberOfImages,
    imageSize,
    requestedNumberOfTokens,
    voiceSimilarityBoost,
    voiceStability,
    temperature: isUsingDefaultTemperature ? undefined : temperature,
    frequencyPenalty: isUsingDefaultTemperature ? undefined : temperature,
    frequency_penalty: isUsingDefaultFrequencyPenalty
      ? undefined
      : frequencyPenalty,
    presencePenalty: isUsingDefaultPresencePenalty
      ? undefined
      : presencePenalty,
    topP: isUsingDefaultTopP ? undefined : topP,
    maxNumberOfTokens,
  };

  if (model === MODEL.Debug) {
    return debug(res);
  }

  if (message.trim().length === 0) {
    res.status(STATUS_CODE.BadRequest).json({
      error: {
        message: "Please enter any input",
      },
    });
    return;
  }

  try {
    if (model === MODEL.Dalle) {
      return dalle(res, openai, message, numberOfImages, imageSize);
    }
    if (model === MODEL.TextToPokemon) {
      return textToPokemon(res, message, numberOfImages);
    }
    if (model === MODEL.StableDiffusionSdXl) {
      return stableDiffusionSdXl(res, message, numberOfImages);
    }
    if (ALL_LLAMA_MODELS.includes(model)) {
      return llama2(res, message, model, processedBody);
    }
    if (model === MODEL.AnimateDiff) {
      return animateDiff(res, message);
    }
    if (model === MODEL.ElevenLabs) {
      return elevenLabs(res, message, voiceSimilarityBoost, voiceStability);
    }
    if (model === MODEL.LocalLlama) {
      return llamaLocal(res, message, temperature, requestedNumberOfTokens);
    }
    if (model === MODEL.FactChecker) {
      return factChecker(res, openai, message);
    }
    if (model === MODEL.Midjourney) {
      return midjourney(res, message);
    }

    // Accepts all versions of GPT 3.5 and GPT 4
    return gpt(res, openai, message, model, processedBody);
  } catch (error) {
    if (error.response) {
      console.error(
        `Error with API response: ${error.response.status}, ${JSON.stringify(
          error.response.data
        )}`
      );
      res.status(error.response.status).json({
        error: {
          message: `Error from API: ${
            error.response.data.message || "No message provided"
          }`,
          status: error.response.status,
          data: error.response.data,
        },
      });
    } else {
      console.error(`Error with API request: ${error.message}`);
      res.status(STATUS_CODE.InternalServerError).json({
        error: {
          message: `An error occurred during your request: ${error.message}`,
        },
      });
    }
  }
}
