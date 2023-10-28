import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import {
  DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
  DEFAULT_TECHNICAL_VOICE_STABILITY,
  IMAGE_SIZE,
  MODEL,
  STATUS_CODE,
} from "../../general/constants";
import { gpt } from "./aiModels/gpt";
import { ProcessedBody } from "./generate";
import { appendContextToTextPrompt } from "../../components/agents/agentFunctions";
import { dalle } from "./aiModels/dalle";
import { animateDiff } from "./aiModels/animateDiff";
import { elevenLabs } from "./aiModels/elevenLabs";
import { stableDiffusionSdXl } from "./aiModels/stableDiffusionSdXl";

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  console.log("the body", req.body);
  const description = req.body.description;
  const api = req.body.api;
  const indication = req.body.indication;
  const context = req.body.context;

  const body: ProcessedBody = {
    numberOfImages: 1,
    imageSize: IMAGE_SIZE.Large,
    requestedNumberOfTokens: 0,
    voiceSimilarityBoost: DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
    voiceStability: DEFAULT_TECHNICAL_VOICE_STABILITY,
    temperature: undefined,
    frequencyPenalty: undefined,
    frequency_penalty: undefined,
    presencePenalty: undefined,
    topP: undefined,
    maxNumberOfTokens: undefined,
  };

  if (api === MODEL.Gpt4) {
    const prompt = appendContextToTextPrompt(description, context, indication);
    // Will use Gpt4_32k
    return gpt(res, openai, prompt, MODEL.Gpt4, body);
  } else if (api === MODEL.Gpt3_5_turbo) {
    const prompt = appendContextToTextPrompt(description, context);
    // Will use Gpt3_5_turbo_16k
    return gpt(res, openai, prompt, MODEL.Gpt3_5_turbo, body);
  } else if (api === MODEL.StableDiffusionSdXl) {
    return stableDiffusionSdXl(res, description, 1);
  } else if (api === MODEL.Dalle) {
    return dalle(res, openai, description, 1, IMAGE_SIZE.Large);
  } else if (api === MODEL.AnimateDiff) {
    return animateDiff(res, description);
  } else if (api === MODEL.ElevenLabs) {
    return elevenLabs(
      res,
      description,
      DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
      DEFAULT_TECHNICAL_VOICE_STABILITY
    );
  }

  res.status(STATUS_CODE.MethodNotAllowed).json({
    error: {
      message: `Tried using an API that is not allowed.`,
    },
  });
  return;
}
