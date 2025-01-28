import { NextApiRequest } from "next";
import {
  DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
  DEFAULT_TECHNICAL_VOICE_STABILITY,
  IMAGE_SIZE_DALL_E_2,
  IMAGE_SIZE_DALL_E_3,
  MODEL,
} from "./constants";

export type ProcessedBody = {
  message: string;
  model: MODEL;
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
  urlsToScrape: string | undefined;
  isUsingSimilaritySearch: boolean | undefined;
  isGivingAiSearchAccess: boolean | undefined;
};

export const getProcessedBodyForAiApiCalls = (
  req: NextApiRequest
): ProcessedBody => {
  const message = req.body.message || "";
  const model: MODEL = req.body.model || MODEL.Debug;
  const numberOfImages = req.body.numberOfImages || 1;
  const imageSize: IMAGE_SIZE_DALL_E_2 | IMAGE_SIZE_DALL_E_3 =
    req.body.imageSize || IMAGE_SIZE_DALL_E_2.Small;
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
  const urlsToScrape = req.body.urlsToScrape || "";
  const isUsingSimilaritySearch = !!req.body.isUsingSimilaritySearch;
  const isGivingAiSearchAccess = !!req.body.isGivingAiSearchAccess;

  return {
    message,
    model,
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
    urlsToScrape,
    isUsingSimilaritySearch,
    isGivingAiSearchAccess,
  } as ProcessedBody;
};
