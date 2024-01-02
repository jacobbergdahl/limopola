import { NextApiRequest, NextApiResponse } from "next";
import { MODEL, STATUS_CODE } from "../../general/constants";
import { gpt } from "./aiModels/gpt";
import { ProcessedBody } from "./generate";
import { AGENT_PROMPT_TASK_LIST } from "../../components/agents/agentPrompts";

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
  };

  if (prompt.trim().length === 0) {
    res.status(STATUS_CODE.BadRequest).json({
      error: {
        message: "The prompt must not be empty.",
      },
    });
    return;
  }

  // MODEL.GPT4_Turbo may, oddly enough, wrap the whole output in code block tags
  return gpt(res, prompt, MODEL.Gpt4, body);
}
