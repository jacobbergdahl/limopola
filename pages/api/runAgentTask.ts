import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import {
  DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
  DEFAULT_TECHNICAL_VOICE_STABILITY,
  IMAGE_SIZE_DALL_E_2,
  IMAGE_SIZE_DALL_E_3,
  MODEL,
  SHOULD_SHOW_ALL_LOGS,
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

let lastAccessTime = 0;
let lastDescription = "";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const currentTimestamp = Date.now();
  const description = req.body.description;

  if (currentTimestamp - lastAccessTime < 3000) {
    const error =
      description === lastDescription
        ? "The agent appears to be making duplicate requests."
        : "The agent appears to be making more requests than it should be.";
    console.error(error);
    res.status(STATUS_CODE.TooManyRequests).json({
      error: error,
    });
    return;
  }

  lastAccessTime = currentTimestamp;
  lastDescription = description;

  const api = req.body.api;
  const indication = req.body.indication;
  const context = req.body.context;
  const codeContext = req.body.codeContext;

  SHOULD_SHOW_ALL_LOGS && console.log("Request body:", req.body);

  const body: ProcessedBody = {
    numberOfImages: 1,
    imageSize: IMAGE_SIZE_DALL_E_2.Large,
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

  if (api === MODEL.Gpt4 || api === MODEL.Gpt4_Turbo) {
    const prompt = appendContextToTextPrompt(
      description,
      context,
      codeContext,
      indication
    );
    // MODEL.Gpt4_Turbo (which is still in preview) has a few issues. It will wrap output in odd delimiters, even though it's not supposed to. Otherwise, it has a significantly better context length and is faster.
    return gpt(res, openai, prompt, MODEL.Gpt4, body);
  } else if (api === MODEL.Gpt3_5_turbo) {
    const prompt = appendContextToTextPrompt(description, context, codeContext);
    return gpt(res, openai, prompt, MODEL.Gpt3_5_turbo, body);
  } else if (api === MODEL.StableDiffusionSdXl) {
    return stableDiffusionSdXl(res, description, 1);
  } else if (api === MODEL.Dalle2) {
    return dalle(res, openai, description, 1, IMAGE_SIZE_DALL_E_2.Large, api);
  } else if (api === MODEL.Dalle3) {
    return dalle(res, openai, description, 1, IMAGE_SIZE_DALL_E_3.One, api);
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
