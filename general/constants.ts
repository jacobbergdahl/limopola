export const IS_DEBUGGING = process.env.NEXT_PUBLIC_IS_DEBUGGING === "true";
export const SHOULD_SHOW_ALL_LOGS =
  process.env.NEXT_PUBLIC_SHOULD_SHOW_ALL_LOGS === "true";
export const DEFAULT_TEMPERATURE = 30;
export const DEFAULT_TECHNICAL_TEMPERATURE = 0.6;
export const DEFAULT_FREQUENCY_PENALTY = 50;
export const DEFAULT_TECHNICAL_FREQUENCY_PENALTY = 0;
export const DEFAULT_PRESENCE_PENALTY = 50;
export const DEFAULT_TECHNICAL_PRESENCE_PENALTY = 0;
export const DEFAULT_TOP_P = 0;
export const DEFAULT_TECHNICAL_TOP_P = 0;
export const DEFAULT_VOICE_STABILITY = 50;
export const DEFAULT_TECHNICAL_VOICE_STABILITY = 0.5;
export const DEFAULT_VOICE_SIMILARITY_BOOST = 50;
export const DEFAULT_TECHNICAL_VOICE_SIMILARITY_BOOST = 0.5;

export enum MODEL {
  Gpt4 = "gpt-4",
  Gpt4_32k = "gpt-4-32k",
  Gpt3_5_turbo = "gpt-3.5-turbo",
  Gpt3_5_turbo_16k = "gpt-3.5-turbo-16k",
  Dalle = "dall-e",
  StableDiffusionSdXl = "stable-diffusion-xl", // full name: stable-diffusion-xl-base-1.0
  Llama2_70b = "llama-2-70b",
  Llama2_13b = "llama-2-13b",
  Llama2_70b_chat = "llama-2-70b-chat",
  Llama2_13b_chat = "llama-2-13b-chat",
  CodeLlama_13b = "codellama-34b",
  TextToPokemon = "text-to-pokemon",
  AnimateDiff = "animate-diff",
  ElevenLabs = "eleven-labs",
  PalmTextBison001 = "text-bison-001",
  PalmChatBison001 = "chat-bison-001",
  FactChecker = "gpt-4-fact-checker",
  Midjourney = "midjourney-imagine",
  LocalLlama = "local-llama",
  Debug = "debug",
}

export enum MODEL_STATUS {
  Full = "Working as expected.",
  Partial = "Working but missing some features.",
  Poor = "Not working as expected.",
  Unknown = "Unknown.",
}

export enum MODEL_API_KEY {
  OpenAi = "OpenAI",
  Replicate = "Replicate",
  ElevenLabs = "ElevenLabs",
  HuggingFace = "HuggingFace",
  Google = "Google",
  None = "None",
}

type ModelInformation = {
  status: MODEL_STATUS;
  information: string;
  learnMoreUrl?: string;
  apiKey?: MODEL_API_KEY;
};

export const getModelInformation = (model: MODEL): ModelInformation => {
  switch (model) {
    case MODEL.Gpt4:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Requires special permission from OpenAI to use. The requirements change constantly, so check the URL to learn more.",
        learnMoreUrl:
          "https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt4_32k:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Same as gpt-4, but with greater context length (and higher cost).",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-4",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Debug:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Only used for debugging this project. Does not contact any external API. You can send empty messages to this endpoint.",
      };
    case MODEL.Gpt3_5_turbo:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Same API as is used in the free tier of ChatGPT. Good starting API for text generation.",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-3-5",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Gpt3_5_turbo_16k:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Same as gpt-3.5-turbo, but with greater context length (and higher cost).",
        learnMoreUrl: "https://platform.openai.com/docs/models/gpt-3-5",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.Dalle:
      return {
        status: MODEL_STATUS.Full,
        information:
          "An OpenAI image generation algorithm that is very easy to use.",
        learnMoreUrl: "https://platform.openai.com/docs/models/dall-e",
        apiKey: MODEL_API_KEY.OpenAi,
      };
    case MODEL.StableDiffusionSdXl:
      return {
        status: MODEL_STATUS.Full,
        information: "Very powerful image generator.",
        learnMoreUrl:
          "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_70b_chat:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A 70 billion parameter language model from Meta, fine tuned for chat completions.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-70b-chat",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_13b_chat:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A 13 billion parameter language model from Meta, fine tuned for chat completions.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-13b-chat",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_13b:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Base version of Llama 2, a 13 billion parameter language model from Meta.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-13b",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Llama2_70b:
      return {
        status: MODEL_STATUS.Full,
        information:
          "Base version of Llama 2, a 70 billion parameter language model from Meta.",
        learnMoreUrl: "https://replicate.com/meta/llama-2-70b",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.CodeLlama_13b:
      return {
        status: MODEL_STATUS.Full,
        information:
          "A 34 billion parameter Llama tuned for coding and conversation.",
        learnMoreUrl: "https://replicate.com/meta/codellama-34b",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.TextToPokemon:
      return {
        status: MODEL_STATUS.Full,
        information: "An API for generating Pokemon images from text.",
        learnMoreUrl: "https://replicate.com/lambdal/text-to-pokemon/api",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.AnimateDiff:
      return {
        status: MODEL_STATUS.Full,
        information:
          "An API for generating short animated mp4's. It takes a while to generate, so please be patient. Note that this model may be a bit more expensive to use than the other models in this project.",
        learnMoreUrl: "https://replicate.com/lucataco/animate-diff",
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.LocalLlama:
      return {
        status: MODEL_STATUS.Full,
        information: `This model runs locally on your machine. If you have have opted to show all logs, then you can see its progress in the NodeJS console. End your message with "Answer:" to get an answer, otherwise you might get a continuation.`,
        learnMoreUrl: "https://llama-node.vercel.app/docs/start",
      };
    case MODEL.ElevenLabs:
      return {
        status: MODEL_STATUS.Full,
        information: `Generates audio from text. You can write text for it to generate as audio, or ask it to generate audio of any existing text message by clicking on it. The learn more link below goes directly to a page that tells you about the stability and similarity boost settings.`,
        learnMoreUrl:
          "https://docs.elevenlabs.io/speech-synthesis/voice-settings",
        apiKey: MODEL_API_KEY.ElevenLabs,
      };
    case MODEL.FactChecker:
      return {
        status: MODEL_STATUS.Full,
        // information: `A custom implementation of a fact-checker using GPT-4 as a basis. Rates the accuracy of any statement on a scale from 0 to 100. Will rate the statement 50 if it is entirely subjective. It will usually rate statements as 0, 50, or 100, hence I might change it to simply present true, false, or debatable instead.`,
        information: `A custom implementation of a fact-checker using GPT-4 as a basis. Rates the accuracy of any statement. Will always return true, false, or debatable. You can send it at list of statements.`,
        apiKey: MODEL_API_KEY.Replicate,
      };
    case MODEL.Midjourney:
      return {
        status: MODEL_STATUS.Full,
        information: `Temp.`,
        learnMoreUrl:
          "https://docs.midjourneyapi.io/midjourney-api/midjourney-api/imagine",
      };
    case MODEL.PalmChatBison001:
      return {
        status: MODEL_STATUS.Partial,
        information: `Google PaLM model for chatting. Optimized for multi-turn chats (dialogues). Not using the API fully correctly yet, but the memory still seems to work well.`,
        learnMoreUrl: "https://developers.generativeai.google/models/language",
        apiKey: MODEL_API_KEY.Google,
      };
    case MODEL.PalmTextBison001:
      return {
        status: MODEL_STATUS.Full,
        information: `Google PaLM model for generating text. Does not work well with multi-turn chats (e.g., the memory feature), but is great for accomplishing tasks like writing code.`,
        learnMoreUrl: "https://developers.generativeai.google/models/language",
        apiKey: MODEL_API_KEY.Google,
      };
  }

  return {
    status: MODEL_STATUS.Unknown,
    information: "There is no information on this model.",
  };
};

export const ALL_TEXT_MODELS = [
  MODEL.Gpt4,
  MODEL.Gpt4_32k,
  MODEL.Gpt3_5_turbo,
  MODEL.Gpt3_5_turbo_16k,
  MODEL.FactChecker,
  MODEL.Llama2_70b,
  MODEL.Llama2_13b,
  MODEL.Llama2_70b_chat,
  MODEL.Llama2_13b_chat,
  MODEL.CodeLlama_13b,
  MODEL.LocalLlama,
  MODEL.PalmTextBison001,
  MODEL.PalmChatBison001,
  MODEL.Debug,
];

export const ALL_VIDEO_MODELS = [MODEL.AnimateDiff];

export const ALL_AUDIO_MODELS = [MODEL.ElevenLabs];

export const ALL_IMAGE_MODELS = [
  MODEL.Dalle,
  MODEL.StableDiffusionSdXl,
  MODEL.TextToPokemon,
  //MODEL.Midjourney,
];

export const ALL_OPEN_AI_MODELS = [
  MODEL.Gpt4,
  MODEL.Gpt4_32k,
  MODEL.Gpt3_5_turbo,
  MODEL.Gpt3_5_turbo_16k,
  MODEL.Dalle,
];

export const ALL_LLAMA_MODELS = [
  MODEL.Llama2_70b,
  MODEL.Llama2_13b,
  MODEL.Llama2_70b_chat,
  MODEL.Llama2_13b_chat,
  MODEL.CodeLlama_13b,
  MODEL.LocalLlama,
];

export const ALL_SLOW_MODELS = [
  MODEL.CodeLlama_13b,
  MODEL.Llama2_70b,
  MODEL.Llama2_70b_chat,
  MODEL.AnimateDiff,
  MODEL.LocalLlama,
];

export enum MEMORY {
  Remember = "On",
  DontRemember = "Off",
}

export const ALL_MEMORY_OPTIONS = [MEMORY.Remember, MEMORY.DontRemember];

export type Message = {
  sender: string;
  id: number;
  content?: string;
  imageUrls?: string[];
  videoUrl?: string;
  audioUrl?: string;
};

export enum MODEL_TYPE {
  Text = "Text",
  Image = "Image",
  Video = "Video",
  Audio = "Audio",
}

export const getModelType = (model: MODEL) => {
  if (ALL_TEXT_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Text;
  }
  if (ALL_IMAGE_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Image;
  }
  if (ALL_VIDEO_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Video;
  }
  if (ALL_AUDIO_MODELS.indexOf(model) > -1) {
    return MODEL_TYPE.Audio;
  }

  return MODEL_TYPE.Text;
};

export enum IMAGE_SIZE {
  Small = "256x256",
  Medium = "512x512",
  Large = "1024x1024",
}

export const getDefaultModel = (): MODEL => {
  if (IS_DEBUGGING) {
    return MODEL.Debug;
  }

  return MODEL.Gpt4;
};

export enum INPUT_MODE {
  Chat = "Chat",
  Editor = "Editor",
  Agent = "Agent",
}

export enum TEXTAREA_STYLE {
  Default = 0,
  Code,
}

export type Context = {
  id: number;
  title: string;
  content: string;
};

export const DEFAULT_CONTEXT: Context = {
  id: 1,
  title: "Default",
  content: "",
};

export enum STATUS_CODE {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  MethodNotAllowed = 405,
  InternalServerError = 500,
}

export enum AGENT_TASK_STATUS {
  Pending = "Pending",
  InProgress = "In-progress",
  Completed = "Completed",
}

export type AgentTask = {
  id: number;
  description: string;
  status: AGENT_TASK_STATUS;
  api: MODEL;
};
