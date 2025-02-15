import { NextApiRequest, NextApiResponse } from "next";
import {
  FLUX_MODE,
  IMAGE_ASPECT_RATIO,
  MODEL,
  STATUS_CODE,
} from "../../general/constants";
import { openAi } from "./aiModels/openAi";
import { AGENT_PROMPT_TASK_LIST } from "../../components/agents/agentPrompts";
import { ProcessedBody } from "../../general/apiHelper";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const mission = req.body.prompt;
  const prompt = AGENT_PROMPT_TASK_LIST + mission;

  const body: ProcessedBody = {
    numberOfImages: 0,
    imageSize: "",
    requestedNumberOfTokens: 0,
    voiceSimilarityBoost: 0,
    voiceStability: 0,
    temperature: 0,
    frequencyPenalty: undefined,
    frequency_penalty: undefined,
    presencePenalty: undefined,
    topP: undefined,
    maxNumberOfTokens: undefined,
    urlsToScrape: "",
    isUsingSimilaritySearch: false,
    isGivingAiSearchAccess: false,
    message: prompt,
    model: MODEL.Gpt4,
    shouldAskBeforeSearching: false,
    returnEmptyStringIfNoSearch: false,
    returnOnlineSearchResultsWithoutAskingLLM: false,
    aspectRatio: IMAGE_ASPECT_RATIO.Landscape,
    fluxMode: FLUX_MODE.Normal,
  };

  if (prompt.trim().length === 0) {
    res.status(STATUS_CODE.BadRequest).json({
      error: {
        message: "The prompt must not be empty.",
      },
    });
    return;
  }

  return openAi(res, prompt, MODEL.Gpt4, body);
}
