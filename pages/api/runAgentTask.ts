import { NextApiRequest, NextApiResponse } from "next";
import {
  ALL_ANTHROPIC_MODELS,
  ALL_FLUX_MODELS,
  DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
  DEFAULT_TECHNICAL_VOICE_STABILITY,
  FLUX_MODE,
  getModelType,
  IMAGE_ASPECT_RATIO,
  IMAGE_SIZE_DALL_E_2,
  IMAGE_SIZE_DALL_E_3,
  MODEL,
  MODEL_TYPE,
  REASONING_EFFORT,
  SHOULD_SHOW_ALL_LOGS,
  STATUS_CODE,
  VERBOSITY,
} from "../../general/constants";
import { openAi } from "./aiModels/openAi";
import { appendContextToTextPrompt } from "../../components/agents/agentFunctions";
import { dalle } from "./aiModels/dalle";
import { animateDiff } from "./aiModels/animateDiff";
import { elevenLabs } from "./aiModels/elevenLabs";
import { stableDiffusionSdXl } from "./aiModels/stableDiffusionSdXl";
import { ProcessedBody } from "../../general/apiHelper";
import { flux } from "./aiModels/flux";
import { claude } from "./aiModels/claude";

const RATE_LIMIT_MS = 500;
let lastAccessTime = 0;
let lastDescription = "";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { description, api, indication, context, codeContext } = req.body;

  const isRateLimited = Date.now() - lastAccessTime < RATE_LIMIT_MS;
  if (isRateLimited) {
    const error =
      description === lastDescription
        ? "The agent appears to be making duplicate requests."
        : "The agent appears to be making more requests than it should be.";

    console.error(error);
    return res.status(STATUS_CODE.TooManyRequests).json({ error });
  }
  const model = api as MODEL;

  lastAccessTime = Date.now();
  lastDescription = description;

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
    urlsToScrape: "",
    isUsingSimilaritySearch: false,
    isGivingAiSearchAccess: false,
    message: "",
    model: model,
    shouldAskBeforeSearching: false,
    returnEmptyStringIfNoSearch: false,
    returnOnlineSearchResultsWithoutAskingLLM: false,
    aspectRatio: IMAGE_ASPECT_RATIO.Landscape,
    fluxMode: FLUX_MODE.Raw,
    reasoningEffort: REASONING_EFFORT.Medium,
    reasoningVerbosity: VERBOSITY.Medium,
  };

  const modelType = getModelType(model);
  if (modelType === MODEL_TYPE.Text) {
    const prompt = appendContextToTextPrompt(
      description,
      context,
      codeContext,
      indication
    );

    if (ALL_ANTHROPIC_MODELS.includes(model)) {
      return claude(res, prompt, model, body);
    }

    return openAi(res, prompt, model, body);
  } else if (model === MODEL.StableDiffusionSdXl) {
    return stableDiffusionSdXl(res, description, 1);
  } else if (ALL_FLUX_MODELS.includes(model)) {
    return flux(res, description, model, body);
  } else if (model === MODEL.Dalle2) {
    return dalle(res, description, 1, IMAGE_SIZE_DALL_E_2.Large, model);
  } else if (model === MODEL.Dalle3) {
    return dalle(res, description, 1, IMAGE_SIZE_DALL_E_3.One, model);
  } else if (model === MODEL.AnimateDiff) {
    return animateDiff(res, description);
  } else if (model === MODEL.ElevenLabs) {
    return elevenLabs(
      res,
      description,
      DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST,
      DEFAULT_TECHNICAL_VOICE_STABILITY
    );
  }

  return res.status(STATUS_CODE.MethodNotAllowed).json({
    error: { message: `Tried using an API that is not allowed.` },
  });
}
