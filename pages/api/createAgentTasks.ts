import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { MODEL, STATUS_CODE } from "../../general/constants";
import { gpt } from "./aiModels/gpt";
import { ProcessedBody } from "./generate";
import { AGENT_PROMPT_TASK_LIST } from "../../components/agents/agentPrompts";

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const prompt = AGENT_PROMPT_TASK_LIST + req.body.prompt;

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
  };

  if (prompt.trim().length === 0) {
    res.status(STATUS_CODE.BadRequest).json({
      error: {
        message: "The prompt must not be empty.",
      },
    });
    return;
  }

  return gpt(res, openai, prompt, MODEL.Gpt4, body);
}