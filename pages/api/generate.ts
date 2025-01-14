import {
  ALL_ANTHROPIC_MODELS,
  ALL_LLAMA_MODELS_REPLICATE,
  ALL_OPEN_AI_MODELS,
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
import { factChecker } from "./aiWrappers/factChecker";
import { NextApiRequest, NextApiResponse } from "next";
import { palm } from "./aiModels/palm";
import { webRetriever } from "./aiWrappers/webRetriever";
import { dataReader } from "./aiWrappers/dataReader";
import { webConnector } from "./aiWrappers/webConnector";
import { getProcessedBodyForAiApiCalls } from "../../general/apiHelper";
import { transformers } from "./aiModels/transformers";
import { ollama } from "./aiModels/ollama";
import { claude } from "./aiModels/claude";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const processedBody = getProcessedBodyForAiApiCalls(req);
  const model = processedBody.model;
  const message = processedBody.message;
  const numberOfImages = processedBody.numberOfImages;
  const imageSize = processedBody.imageSize;
  const temperature = processedBody.temperature;
  const voiceSimilarityBoost = processedBody.voiceSimilarityBoost;
  const voiceStability = processedBody.voiceStability;
  const urlsToScrape = processedBody.urlsToScrape;
  const isUsingSimilaritySearch = processedBody.isUsingSimilaritySearch;
  const isGivingAiSearchAccess = processedBody.isGivingAiSearchAccess;

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
    if (isGivingAiSearchAccess) {
      return webConnector(res, message, model, processedBody);
    }
    if (model === MODEL.Dalle2 || model === MODEL.Dalle3) {
      return dalle(res, message, numberOfImages, imageSize, model);
    }
    if (model === MODEL.TextToPokemon) {
      return textToPokemon(res, message, numberOfImages);
    }
    if (model === MODEL.StableDiffusionSdXl) {
      return stableDiffusionSdXl(res, message, numberOfImages);
    }
    if (ALL_LLAMA_MODELS_REPLICATE.includes(model)) {
      return llama2(res, message, model, processedBody);
    }
    if (model === MODEL.AnimateDiff) {
      return animateDiff(res, message);
    }
    if (model === MODEL.ElevenLabs) {
      return elevenLabs(res, message, voiceSimilarityBoost, voiceStability);
    }
    if (model === MODEL.LocalLlm) {
      return llamaLocal(res, message, processedBody);
    }
    if (model === MODEL.LocalOllama) {
      return ollama(res, message, processedBody);
    }
    if (model === MODEL.FactChecker) {
      return factChecker(res, message);
    }
    if (model === MODEL.WebRetriever) {
      return webRetriever(
        res,
        message,
        MODEL.Gpt4,
        processedBody,
        urlsToScrape,
        isUsingSimilaritySearch
      );
    }
    if (model === MODEL.GptDataReader) {
      return dataReader(res, message, MODEL.Gpt4_o, processedBody);
    }
    if (model === MODEL.ClaudeDataReader) {
      return dataReader(res, message, MODEL.Claude35Sonnet, processedBody);
    }
    if (
      model === MODEL.TransformersSentimentAnalysis ||
      model === MODEL.TransformersText2Text
    ) {
      return transformers(res, message, model, processedBody);
    }
    if (model === MODEL.PalmChatBison001 || model === MODEL.PalmTextBison001) {
      return palm(res, message, model, temperature);
    }
    if (ALL_OPEN_AI_MODELS.includes(model)) {
      return gpt(res, message, model, processedBody);
    }
    if (ALL_ANTHROPIC_MODELS.includes(model)) {
      return claude(res, message, model, processedBody);
    }

    res.status(STATUS_CODE.NotImplemented).json({
      error: {
        message: "The AI model could not be found.",
      },
    });
    return;
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
